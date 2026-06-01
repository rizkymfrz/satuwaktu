"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { Chapter, FragmenWithRelations } from "@satuwaktu/types";
import { api } from "@/shared/lib/api";
import { OwnerProvider } from "@/shared/lib/owner-context";
import { FragmenBento } from "@/widgets/fragmen-bento/ui/fragmen-bento";
import { FragmenTimeline } from "@/widgets/fragmen-timeline/ui/fragmen-timeline";
import { ChapterGrid } from "@/widgets/chapter-grid/ui/chapter-grid";
import { HariIniDulu } from "@/widgets/hari-ini-dulu/ui/hari-ini-dulu";
import { Navbar } from "@/widgets/navbar/ui/navbar";
import { AddFragmenDrawer } from "@/features/fragmen-create/ui/add-fragmen-drawer";
import { AppFooter } from "@/widgets/app-footer";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";

const NavbarFallback = () => {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="mx-auto flex max-w-5xl items-center px-4 py-2">
        <Skeleton className="h-5 w-24" />
        <div className="ml-auto flex gap-2">
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="size-8 rounded-md" />
        </div>
      </div>
      <div className="border-t py-1 sm:hidden">
        <div className="flex gap-1 px-4">
          <Skeleton className="h-7 flex-1 rounded-md" />
          <Skeleton className="h-7 flex-1 rounded-md" />
          <Skeleton className="h-7 flex-1 rounded-md" />
        </div>
      </div>
    </header>
  );
};

const ContentFallback = () => {
  return (
    <div className="columns-2 gap-1.5 sm:columns-3 sm:gap-2 lg:columns-4">
      {[48, 32, 56, 40, 64, 36, 52, 44].map((h, i) => (
        <div key={i} className="mb-1.5 break-inside-avoid sm:mb-2">
          <Skeleton
            className="w-full rounded-lg"
            style={{ height: `${h * 4}px` }}
          />
        </div>
      ))}
    </div>
  );
};

interface RuangViewProps {
  fragmens: FragmenWithRelations[];
  chapters: Chapter[];
}

const RuangContent = ({ fragmens, chapters }: RuangViewProps) => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") ?? "";
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    api.auth
      .me()
      .then(() => setIsOwner(true))
      .catch(() => {});
  }, []);

  const filteredFragmens = selectedChapter
    ? fragmens.filter((f) => f.chapterId === selectedChapter)
    : fragmens;

  const sortedFragmens = [...filteredFragmens].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const today = format(new Date(), "EEEE, d MMMM", { locale: id });

  return (
    <OwnerProvider isOwner={isOwner}>
      <div>
        {mode === "" && (
          <p className="mb-4 text-xs font-medium capitalize text-muted-foreground">
            {today}
          </p>
        )}
        {mode === "" && <HariIniDulu />}
        {mode === "" && chapters.length > 0 && (
          <div className="mb-4 flex items-center gap-4 overflow-x-auto">
            <p className="shrink-0 text-xs font-semibold">Chapter:</p>
            <div className="flex items-center gap-1">
              <Badge
                variant={selectedChapter === null ? "default" : "outline"}
                className="cursor-pointer shrink-0"
                onClick={() => setSelectedChapter(null)}
              >
                Semua
              </Badge>
              {chapters.map((c) => (
                <Badge
                  key={c.id}
                  variant={selectedChapter === c.id ? "default" : "outline"}
                  className="cursor-pointer shrink-0"
                  onClick={() => setSelectedChapter(c.id)}
                >
                  {c.title}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {mode === "" && isOwner && (
          <div className="mb-4">
            <AddFragmenDrawer />
          </div>
        )}
        {mode === "timeline" && (
          <FragmenTimeline items={fragmens} isOwner={isOwner} />
        )}
        {mode === "chapter" && (
          <ChapterGrid
            chapters={chapters}
            fragmens={fragmens}
            isOwner={isOwner}
          />
        )}
        {mode === "" && (
          <FragmenBento initial={sortedFragmens} chapterId={selectedChapter} />
        )}
      </div>
    </OwnerProvider>
  );
};

export const RuangView = ({ fragmens, chapters }: RuangViewProps) => {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<NavbarFallback />}>
        <Navbar />
      </Suspense>
      <main className="mx-auto max-w-5xl px-3 py-4 sm:px-4 sm:py-6">
        <Suspense fallback={<ContentFallback />}>
          <RuangContent fragmens={fragmens} chapters={chapters} />
        </Suspense>
        <AppFooter fragmens={fragmens} />
      </main>
    </div>
  );
};
