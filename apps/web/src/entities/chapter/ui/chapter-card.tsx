import Image from "next/image";
import Link from "next/link";
import type { Chapter, Media } from "@satuwaktu/types";
import { Skeleton } from "@/shared/ui/skeleton";
import { ChapterActionsMenu } from "@/features/chapter/ui/chapter-actions-menu";

const STACK_CLASSES: Record<number, string> = {
  0: "rotate-[-8deg] group-hover:rotate-[-16deg]",
  1: "rotate-[6deg] group-hover:rotate-[12deg]",
  2: "rotate-[-3deg] group-hover:rotate-[-4deg]",
};

const PLACEHOLDER_COLORS = [
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-700",
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-orange-100 text-orange-700",
];

const placeholderColor = (id: string): string => {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return PLACEHOLDER_COLORS[hash % PLACEHOLDER_COLORS.length]!;
};

interface ChapterCardProps {
  chapter: Chapter & { _count?: { fragmens: number } };
  mediaStack?: Media[];
  fragmenCount?: number;
  isOwner?: boolean;
}

export const ChapterCard = ({
  chapter,
  mediaStack = [],
  fragmenCount,
  isOwner = false,
}: ChapterCardProps) => {
  const stack = mediaStack.slice(0, 3);
  const count = fragmenCount ?? chapter._count?.fragmens;
  const initials = chapter.title.slice(0, 2).toUpperCase();

  return (
    <div className="group relative flex flex-col items-center gap-2">
      <Link
        href={`/chapter/${chapter.slug}`}
        className="relative aspect-square w-full"
      >
        {stack.length > 0 ? (
          [...stack].reverse().map((m, revI) => {
            const i = stack.length - 1 - revI;
            return (
              <div
                key={m.id}
                className={`absolute inset-0 overflow-hidden rounded-lg transition-transform duration-300 ${STACK_CLASSES[i] ?? ""}`}
                style={{ zIndex: i + 1 }}
              >
                <Image
                  src={m.url}
                  alt={chapter.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 30vw, (max-width: 1024px) 22vw, 18vw"
                />
              </div>
            );
          })
        ) : chapter.coverUrl ? (
          <div className="absolute inset-0 overflow-hidden rounded-lg">
            <Image
              src={chapter.coverUrl}
              alt={chapter.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 30vw, (max-width: 1024px) 22vw, 18vw"
            />
          </div>
        ) : (
          <div
            className={`absolute inset-0 flex items-center justify-center rounded-lg ${placeholderColor(chapter.id)}`}
          >
            <span className="text-xl font-bold opacity-60">{initials}</span>
          </div>
        )}
      </Link>
      <div className="absolute right-1 top-1 z-20">
        <ChapterActionsMenu chapter={chapter} isOwner={isOwner} />
      </div>
      <div className="w-full text-center">
        <p className="line-clamp-2 text-xs font-semibold leading-tight">
          {chapter.title}
        </p>
        {count !== undefined && (
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            {count} fragmen
          </p>
        )}
      </div>
    </div>
  );
};

export const ChapterCardSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-2">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <Skeleton className="h-3 w-3/4 rounded" />
      <Skeleton className="h-2.5 w-1/2 rounded" />
    </div>
  );
};
