import { api } from "@/shared/lib/api";
import { RuangView } from "@/views/ruang/ui/ruang-view";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [fragmens, chapters] = await Promise.all([
    api.fragmen.list({ limit: 20 }),
    api.chapter.list(),
  ]);

  return <RuangView fragmens={fragmens} chapters={chapters} />;
}
