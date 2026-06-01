"use client";
import { useEffect, useState } from "react";
import type { FragmenWithRelations } from "@satuwaktu/types";
import { Separator } from "@/shared/ui/separator";
import { ArrowUp } from "lucide-react";

const QUOTES = [
  "kenangan bukan milik masa lalu. ia hidup di antara dua orang yang pernah hadir di saat yang sama.",
  "ada yang tidak perlu diingat — karena tidak pernah pergi.",
  "beberapa momen tidak butuh kata-kata. cukup ada, dan selalu akan pernah ada.",
  "waktu berjalan. tapi yang pernah terjadi, tidak pernah bisa tidak terjadi.",
  "ini bukan arsip. ini adalah bukti bahwa kita pernah, dan masih, ada.",
  "yang kita simpan di sini bukan foto. tapi bukti bahwa waktu itu nyata.",
  "setiap fragmen adalah janji — bahwa momen ini tidak akan pernah benar-benar selesai.",
];

interface AppFooterProps {
  fragmens: FragmenWithRelations[];
}

export const AppFooter = ({ fragmens }: AppFooterProps) => {
  const [quoteIdx, setQuoteIdx] = useState<number | null>(null);

  useEffect(() => {
    setQuoteIdx(Math.floor(Math.random() * QUOTES.length));
  }, []);

  const totalFragmens = fragmens.length;
  const totalKomentar = fragmens.reduce(
    (acc, f) => acc + (f._count?.titipanKata ?? 0),
    0,
  );
  const oldest = fragmens.reduce<FragmenWithRelations | null>((min, f) => {
    if (!min) return f;
    return new Date(f.takenAt) < new Date(min.takenAt) ? f : min;
  }, null);
  const daysSince = oldest
    ? Math.floor((Date.now() - new Date(oldest.takenAt).getTime()) / 86_400_000)
    : 0;

  const quote = quoteIdx !== null ? QUOTES[quoteIdx] : null;

  return (
    <footer className="py-4">
      <div className="mb-4">
        <p className="text-base italic text-foreground">
          {quote ? `"${quote}"` : ""}
        </p>
      </div>
      <Separator className="mb-4" />
      <div className="mb-4 flex gap-4">
        <div className="flex flex-col gap-1 flex-1 text-center">
          <span className="text-base font-medium text-foreground">
            {totalFragmens}
          </span>
          <span className="text-xs text-muted-foreground">
            fragmen <br /> diabadikan
          </span>
        </div>
        <div className="flex flex-col gap-1 flex-1 text-center">
          <span className="text-base font-medium text-foreground">
            {daysSince}
          </span>
          <span className="text-xs text-muted-foreground">
            hari yang telah dijalani
          </span>
        </div>
        <div className="flex flex-col gap-1 flex-1 text-center">
          <span className="text-base font-medium text-foreground">
            {totalKomentar}
          </span>
          <span className="text-xs text-muted-foreground">
            titipan kata <br /> ditinggalkan
          </span>
        </div>
      </div>
      <Separator className="mb-4" />
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-base text-foreground">satuwaktu</span>
          <span className="text-xs text-muted-foreground">
            dibuat oleh rizkymfrz
          </span>
        </div>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-xs text-muted-foreground flex items-center gap-1"
        >
          <ArrowUp className="size-4" />
          kembali ke atas
        </button>
      </div>
    </footer>
  );
};
