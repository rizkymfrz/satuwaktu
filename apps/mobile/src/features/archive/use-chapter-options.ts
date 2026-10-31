import { MAX_CHAPTER_NAME_LENGTH } from "@repo/dto";
import { isApiError, useChapters, useCreateChapter } from "@repo/sdk";
import { toast } from "@/components/ui/sonner";
import type { ChapterRef } from "@/features/archive/types";

function useChapterOptions() {
  const query = useChapters();
  const { mutateAsync } = useCreateChapter();
  const chapters: ChapterRef[] = query.data ?? [];
  const createChapter = async (name: string): Promise<ChapterRef | null> => {
    const clean = name.trim().replace(/\s+/g, " ");
    if (!clean) {
      return null;
    }
    if (clean.length > MAX_CHAPTER_NAME_LENGTH) {
      toast.error(`Nama babak maksimal ${MAX_CHAPTER_NAME_LENGTH} karakter.`);
      return null;
    }
    const existing = chapters.find(
      (item) => item.name.toLowerCase() === clean.toLowerCase(),
    );
    if (existing) {
      return existing;
    }
    try {
      return await mutateAsync({ name: clean });
    } catch (error) {
      toast.error(
        isApiError(error) && error.status === 409
          ? "Babak sudah ada."
          : "Gagal membuat babak.",
      );
      return null;
    }
  };
  return { chapters, createChapter };
}

export { useChapterOptions };
