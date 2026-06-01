import { notFound } from "next/navigation";
import { api } from "@/shared/lib/api";
import { FragmenDetailView } from "@/views/fragmen-detail/ui/fragmen-detail-view";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const [fragmen, resonansi, titipanKata] = await Promise.all([
    api.fragmen.get(id).catch(() => null),
    api.resonansi.getCounts(id).catch(() => ({
      BEEN_HERE: 0,
      BEING_HERE: 0,
      MISS_THIS: 0,
      total: 0,
    })),
    api.titipanKata.list(id).catch(() => []),
  ]);

  if (!fragmen) notFound();

  return (
    <FragmenDetailView
      fragmen={fragmen}
      resonansi={resonansi}
      titipanKata={titipanKata}
    />
  );
}
