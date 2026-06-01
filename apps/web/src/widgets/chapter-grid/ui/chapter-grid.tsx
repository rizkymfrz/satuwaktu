import { BookOpen } from "lucide-react";
import type { Chapter, FragmenWithRelations } from "@satuwaktu/types";
import { ChapterCard } from "@/entities/chapter/ui/chapter-card";
import { AddChapterDrawer } from "@/features/chapter/ui/add-chapter-drawer";

interface ChapterGridProps {
  chapters: Chapter[];
  fragmens?: FragmenWithRelations[];
  isOwner?: boolean;
}

export const ChapterGrid = ({
  chapters,
  fragmens = [],
  isOwner = false,
}: ChapterGridProps) => {
  if (chapters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <BookOpen className="mb-4 size-10 text-muted-foreground" />
        <p className="mb-1 text-sm font-medium">Belum ada chapter</p>
        <p className="mb-6 text-xs text-muted-foreground">
          Buat chapter untuk mengelompokkan fragmenmu.
        </p>
        {isOwner && (
          <div className="w-32">
            <AddChapterDrawer />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-5">
      {isOwner && <AddChapterDrawer />}
      {chapters.map((c) => {
        const chapterFragmens = fragmens.filter((f) => f.chapterId === c.id);
        const mediaStack = chapterFragmens.flatMap((f) => f.media).slice(0, 3);
        const fragmenCount = chapterFragmens.length;

        return (
          <ChapterCard
            key={c.id}
            chapter={c}
            mediaStack={mediaStack}
            fragmenCount={fragmenCount}
            isOwner={isOwner}
          />
        );
      })}
    </div>
  );
};
