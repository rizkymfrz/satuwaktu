"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Pin } from "lucide-react";
import type {
  FragmenWithRelations,
  ResonansiCount,
  TitipanKata,
} from "@satuwaktu/types";
import { MOOD_LABELS } from "@satuwaktu/constants";
import { api } from "@/shared/lib/api";
import { AspectRatio } from "@/shared/ui/aspect-ratio";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import { ResonansiButtons } from "@/features/resonansi/ui/resonansi-buttons";
import { TitipanKataList } from "@/features/titipan-kata/ui/titipan-kata-list";
import { TitipanKataForm } from "@/features/titipan-kata/ui/titipan-kata-form";
import { FragmenActionsMenu } from "@/features/fragmen/ui/fragmen-actions-menu";

interface FragmenDetailViewProps {
  fragmen: FragmenWithRelations;
  resonansi: ResonansiCount;
  titipanKata: TitipanKata[];
}

export function FragmenDetailView({
  fragmen,
  resonansi,
  titipanKata: initialTitipanKata,
}: FragmenDetailViewProps) {
  const [titipanKata, setTitipanKata] = useState(initialTitipanKata);
  const [isOwner, setIsOwner] = useState(false);
  const [cover, ...rest] = fragmen.media;

  useEffect(() => {
    api.auth
      .me()
      .then(() => setIsOwner(true))
      .catch(() => {});
  }, []);

  const refreshTitipanKata = async () => {
    const { api: freshApi } = await import("@/shared/lib/api");
    const updated = await freshApi.titipanKata.list(fragmen.id);
    setTitipanKata(updated);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Main image */}
      {cover && (
        <div className="mb-4 overflow-hidden rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.12)]">
          {cover.width && cover.height ? (
            <AspectRatio ratio={cover.width / cover.height}>
              <Image
                src={cover.url}
                alt={fragmen.caption ?? "fragmen"}
                fill
                className="object-contain"
                priority
              />
            </AspectRatio>
          ) : (
            <Image
              src={cover.url}
              alt={fragmen.caption ?? "fragmen"}
              width={1200}
              height={900}
              className="h-auto w-full object-contain"
              priority
            />
          )}
        </div>
      )}

      {/* Additional media thumbnails */}
      {rest.length > 0 && (
        <div className="mb-4 grid grid-cols-3 gap-2">
          {rest.map((m) => (
            <div key={m.id} className="overflow-hidden rounded-lg shadow-sm">
              <Image
                src={m.url}
                alt={fragmen.caption ?? "fragmen"}
                width={400}
                height={400}
                className="h-24 w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Header row: badges + actions menu */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {fragmen.chapter && (
            <Link href={`/chapter/${fragmen.chapter.slug}`}>
              <Badge variant="outline" className="text-xs hover:bg-muted">
                {fragmen.chapter.title}
              </Badge>
            </Link>
          )}
          {fragmen.isPinned && (
            <Badge variant="secondary" className="gap-1 text-xs">
              <Pin className="size-2.5 fill-current" />
              Disematkan
            </Badge>
          )}
          {fragmen.mood && (
            <Badge variant="secondary" className="text-xs">
              {MOOD_LABELS[fragmen.mood]}
            </Badge>
          )}
        </div>
        <div className="shrink-0">
          <FragmenActionsMenu fragmen={fragmen} isOwner={isOwner} />
        </div>
      </div>

      {fragmen.title && (
        <h1 className="mb-1 text-xl font-semibold">{fragmen.title}</h1>
      )}
      {fragmen.caption && (
        <p className="mb-2 font-serif text-lg italic">{fragmen.caption}</p>
      )}
      <p className="mb-6 text-sm text-muted-foreground">
        {format(new Date(fragmen.takenAt), "EEEE, d MMMM yyyy", { locale: id })}
      </p>

      <Separator className="mb-6" />
      <ResonansiButtons fragmenId={fragmen.id} initial={resonansi} />
      <Separator className="my-6" />

      <h2 className="mb-4 text-sm font-medium">Titipan Kata</h2>
      <TitipanKataList items={titipanKata} />
      <div className="mt-4">
        <TitipanKataForm
          fragmenId={fragmen.id}
          onSubmitted={() => void refreshTitipanKata()}
        />
      </div>
    </div>
  );
}
