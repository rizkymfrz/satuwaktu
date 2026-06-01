"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { LayoutGrid, AlignLeft } from "lucide-react";
import type { Chapter, FragmenWithRelations } from "@satuwaktu/types";
import { api } from "@/shared/lib/api";
import { OwnerProvider } from "@/shared/lib/owner-context";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import { FragmenBento } from "@/widgets/fragmen-bento/ui/fragmen-bento";
import { FragmenTimeline } from "@/widgets/fragmen-timeline/ui/fragmen-timeline";

interface ChapterDetailViewProps {
  chapter: Chapter;
  fragmens: FragmenWithRelations[];
}

export function ChapterDetailView({
  chapter,
  fragmens,
}: ChapterDetailViewProps) {
  const [mode, setMode] = useState<"bento" | "timeline">("bento");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    api.auth
      .me()
      .then(() => setIsOwner(true))
      .catch(() => {});
  }, []);

  const sortedFragmens = [...fragmens].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <OwnerProvider isOwner={isOwner}>
      <div className="mx-auto max-w-5xl px-4 py-8">
        {chapter.coverUrl && (
          <div className="mb-6 overflow-hidden rounded-xl shadow-sm">
            <Image
              src={chapter.coverUrl}
              alt={chapter.title}
              width={1200}
              height={400}
              className="h-48 w-full object-cover sm:h-64"
            />
          </div>
        )}

        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{chapter.title}</h1>
            {chapter.description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {chapter.description}
              </p>
            )}
          </div>
          <Badge variant="outline" className="shrink-0 text-xs">
            {fragmens.length} fragmen
          </Badge>
        </div>

        <Separator className="mb-4" />

        <div className="mb-4 flex items-center gap-1">
          <button
            onClick={() => setMode("bento")}
            className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === "bento"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="size-3.5" />
            Bento
          </button>
          <button
            onClick={() => setMode("timeline")}
            className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === "timeline"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <AlignLeft className="size-3.5" />
            Timeline
          </button>
        </div>

        {mode === "bento" && (
          <FragmenBento initial={sortedFragmens} chapterId={chapter.id} />
        )}
        {mode === "timeline" && (
          <FragmenTimeline items={fragmens} isOwner={isOwner} />
        )}
      </div>
    </OwnerProvider>
  );
}
