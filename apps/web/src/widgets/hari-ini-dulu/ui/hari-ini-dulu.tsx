"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { FragmenWithRelations } from "@satuwaktu/types";
import { api } from "@/shared/lib/api";
import { Separator } from "@/shared/ui/separator";
import { ArrowRight } from "lucide-react";

const ROTATIONS = [0, -10, 10];

function yearLabel(yearsAgo: number): string {
  if (yearsAgo === 1) return "Hari Ini, Satu Tahun Lalu";
  return `Hari Ini, ${yearsAgo} Tahun Lalu`;
}

export const HariIniDulu = () => {
  const [items, setItems] = useState<FragmenWithRelations[]>([]);

  useEffect(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    api.fragmen
      .list({ limit: 1000 })
      .then((all) => {
        return all.filter((f) => {
          const d = new Date(f.takenAt);
          const match =
            d.getMonth() + 1 === month &&
            d.getDate() === day &&
            d.getFullYear() < now.getFullYear();
          return match;
        });
      })
      .then(setItems);
  }, []);

  if (items.length === 0) return null;

  const grouped = items.reduce<Record<number, FragmenWithRelations[]>>(
    (acc, f) => {
      const year = new Date(f.takenAt).getFullYear();
      if (!acc[year]) acc[year] = [];
      acc[year].push(f);
      return acc;
    },
    {},
  );

  const yearGroups = Object.entries(grouped).sort(
    ([a], [b]) => Number(b) - Number(a),
  );

  const currentYear = new Date().getFullYear();

  return (
    <>
      <div className="flex-1 gap-4 pb-1">
        {yearGroups.map(([yearStr, fragmens]) => {
          const year = Number(yearStr);
          const yearsAgo = currentYear - year;
          const first = fragmens[0]!;
          const allMedia = fragmens.flatMap((f) => f.media);
          const stack = allMedia.slice(0, 3);
          const caption = first.caption ?? first.title;

          return (
            <Link
              key={year}
              href={`/fragmen/${first.id}`}
              className="flex shrink-0 gap-4"
            >
              <div className="relative h-24 w-24 shrink-0">
                {[...stack].reverse().map((m, revI) => {
                  const i = stack.length - 1 - revI;
                  return (
                    <div
                      key={m.id}
                      className="absolute inset-0 overflow-hidden rounded-lg"
                      style={{
                        transform: `rotate(${ROTATIONS[i] ?? 0}deg)`,
                        zIndex: i + 1,
                      }}
                    >
                      <Image
                        src={m.url}
                        alt={first.caption ?? "fragmen"}
                        fill
                        className="object-cover"
                        quality={100}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex max-w-1/2 flex-col justify-between py-1">
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs font-semibold text-muted-foreground">
                    {yearLabel(yearsAgo)}
                  </p>
                  {caption && (
                    <p className="text-sm font-semibold wrap-break-word line-clamp-3">
                      {caption}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Lihat Fragmen Ini
                  </p>
                  <ArrowRight className="size-3 text-muted-foreground" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <Separator className="my-4" />
    </>
  );
};
