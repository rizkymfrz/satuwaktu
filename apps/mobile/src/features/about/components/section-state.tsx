import type { ReactNode } from "react";
import { QueryError } from "@/components/layout/query-error";

function SectionState({
  status,
  skeleton,
  onRetry,
}: {
  status: "loading" | "error";
  skeleton: ReactNode;
  onRetry: () => void;
}) {
  if (status === "loading") {
    return skeleton;
  }
  return (
    <QueryError
      message="Tidak bisa memuat bagian ini"
      onRetry={onRetry}
      className="py-4"
    />
  );
}

export { SectionState };
