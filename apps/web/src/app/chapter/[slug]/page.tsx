import { notFound } from "next/navigation";
import { api } from "@/shared/lib/api";
import { ChapterDetailView } from "@/views/chapter-detail/ui/chapter-detail-view";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const chapter = await api.chapter.findBySlug(slug).catch(() => null);
  if (!chapter) notFound();

  const fragmens = await api.fragmen
    .list({ chapterId: chapter.id, limit: 100 })
    .catch(() => []);

  return <ChapterDetailView chapter={chapter} fragmens={fragmens} />;
}
