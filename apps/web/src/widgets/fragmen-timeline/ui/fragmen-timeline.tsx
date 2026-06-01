"use client";

import { format, differenceInDays, isSameMonth } from "date-fns";
import { id } from "date-fns/locale";
import { Pin, Camera, Scissors } from "lucide-react";
import type { FragmenWithRelations } from "@satuwaktu/types";
import { FragmenCard } from "@/entities/fragmen/ui/fragmen-card";
import { FragmenActionsMenu } from "@/features/fragmen/ui/fragmen-actions-menu";

const gapLabel = (days: number): string | null => {
  if (days < 7) return null;
  if (days < 30) return `${days} hari berlalu`;
  if (days < 365) return `${Math.round(days / 30)} bulan berlalu`;
  return `${Math.round(days / 365)} tahun berlalu`;
};

interface FragmenTimelineProps {
  items: FragmenWithRelations[];
  isOwner?: boolean;
}

export const FragmenTimeline = ({
  items,
  isOwner = false,
}: FragmenTimelineProps) => {
  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center py-24 text-center">
        <Camera className="mb-4 size-10 text-muted-foreground" />
        <p className="mb-1 text-sm font-medium">Belum ada fragmen</p>
        <p className="text-xs text-muted-foreground">
          {isOwner
            ? "Tap tombol + di atas untuk abadikan momen pertamamu."
            : "Belum ada momen yang diabadikan."}
        </p>
      </div>
    );
  }

  const sorted = [...items].sort(
    (a, b) => new Date(a.takenAt).getTime() - new Date(b.takenAt).getTime(),
  );

  return (
    <div className="mx-auto max-w-2xl">
      <div className="relative">
        <div className="absolute bottom-0 left-16 top-0 w-0 border-l-2 border-dashed border-border" />
        <div className="space-y-0">
          {sorted.map((f, i) => {
            const takenAt = new Date(f.takenAt);
            const prevItem = i > 0 ? sorted[i - 1] : null;
            const prevDate = prevItem ? new Date(prevItem.takenAt) : null;
            const showMonthDivider =
              !prevDate || !isSameMonth(takenAt, prevDate);
            const daysDiff = prevDate ? differenceInDays(takenAt, prevDate) : 0;
            const gap =
              !showMonthDivider && prevDate ? gapLabel(daysDiff) : null;

            return (
              <div key={f.id}>
                {showMonthDivider && (
                  <div className="relative py-2">
                    <div className="ml-9 inline-block rotate-[-0.10deg] bg-primary px-4 py-2 rounded-lg">
                      <span className="text-xs font-bold uppercase text-primary-foreground">
                        {format(takenAt, "MMMM yyyy", { locale: id })}
                      </span>
                    </div>
                  </div>
                )}
                {gap && (
                  <div className="relative flex items-center py-2">
                    <div className="absolute left-16 z-10 -translate-x-1/2 bg-background p-0.5">
                      <Scissors className="size-4 rotate-90 text-muted-foreground" />
                    </div>
                    <div className="w-16 shrink-0" />
                    <div className="ml-5 flex items-center gap-2">
                      <div className="h-px w-4 border-t border-dashed border-muted-foreground" />
                      <span className="text-xs italic text-muted-foreground">
                        {gap}
                      </span>
                      <div className="h-px flex-1 border-t border-dashed border-muted-foreground" />
                    </div>
                  </div>
                )}
                <div className="relative flex items-start pb-2">
                  <div className="w-16 shrink-0 pr-4 pt-1 text-right">
                    <span className="block text-xs font-medium leading-tight text-muted-foreground">
                      {format(takenAt, "d MMM", { locale: id })}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {format(takenAt, "yyyy")}
                    </span>
                  </div>
                  <div className="absolute left-16 z-10 -translate-x-1/2 mt-2">
                    <div className="rounded-full border-2 border-background ring-1 ring-primary bg-primary size-4" />
                  </div>
                  <div className="group relative flex-1 pl-4 pb-2 space-y-2">
                    <FragmenCard fragmen={f} />
                    <div className="absolute right-2 top-2 z-10">
                      <FragmenActionsMenu fragmen={f} isOwner={isOwner} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
