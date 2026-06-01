"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function LandingView() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.push("/ruang"), 2000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div
      className="flex min-h-screen cursor-pointer items-center justify-center"
      onClick={() => router.push("/ruang")}
    >
      <p className="animate-fade-in text-center text-2xl font-light tracking-widest text-foreground/80 italic">
        ada yang tak terlupakan, walau tak terucap.
      </p>
    </div>
  );
}
