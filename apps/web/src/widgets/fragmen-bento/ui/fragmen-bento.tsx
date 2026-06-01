"use client";

import { useEffect, useRef, useState } from "react";
import { Pin } from "lucide-react";
import type { FragmenWithRelations } from "@satuwaktu/types";
import { cn } from "@/shared/lib/cn";
import { api } from "@/shared/lib/api";
import { useIsOwner } from "@/shared/lib/owner-context";
import {
  FragmenCard,
  FragmenCardSkeleton,
} from "@/entities/fragmen/ui/fragmen-card";
import { FragmenActionsMenu } from "@/features/fragmen/ui/fragmen-actions-menu";
import { Separator } from "@/shared/ui/separator";

interface FragmenBentoProps {
  initial: FragmenWithRelations[];
  chapterId?: string | null;
}

const BentoGrid = ({ items }: { items: FragmenWithRelations[] }) => {
  const isOwner = useIsOwner();

  return (
    <div className="columns-2 gap-2 sm:columns-3 sm:gap-2 lg:columns-4">
      {items.map((f) => (
        <div
          key={f.id}
          className={cn(
            "group relative break-inside-avoid mb-2",
            f.isPinned && "rounded-lg ring-2 ring-primary",
          )}
        >
          {f.isPinned && (
            <div className="absolute right-2 top-2 z-10">
              <Pin className="size-4 fill-white text-white rotate-45" />
            </div>
          )}
          <FragmenCard fragmen={f} />
          <div className="absolute left-2 top-2 z-20">
            <FragmenActionsMenu fragmen={f} isOwner={isOwner} />
          </div>
        </div>
      ))}
    </div>
  );
};

export const FragmenBento = ({ initial, chapterId }: FragmenBentoProps) => {
  const [items, setItems] = useState(initial);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setItems(initial);
    setPage(2);
    setHasMore(true);
  }, [initial, chapterId]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !loading) {
          void loadMore();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  const loadMore = async () => {
    setLoading(true);
    try {
      const next = await api.fragmen.list({
        page,
        limit: 20,
        ...(chapterId ? { chapterId } : {}),
      });
      if (next.length === 0) {
        setHasMore(false);
      } else {
        setItems((prev) => [...prev, ...next]);
        setPage((p) => p + 1);
      }
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm text-muted-foreground">Belum ada fragmen.</p>
      </div>
    );
  }

  const pinnedItems = items.filter((f) => f.isPinned);
  const regularItems = items.filter((f) => !f.isPinned);

  return (
    <div>
      {pinnedItems.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-1">
            <Pin className="size-4 fill-primary text-primary" />
            <span className="text-xs font-semibold text-muted-foreground">
              Disematkan
            </span>
          </div>
          <BentoGrid items={pinnedItems} />
          <Separator className="my-4" />
        </div>
      )}
      <BentoGrid items={regularItems} />
      {loading &&
        Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="mb-2 break-inside-avoid">
            <FragmenCardSkeleton />
          </div>
        ))}
      <div ref={sentinelRef} className="h-8" />
    </div>
  );
};
