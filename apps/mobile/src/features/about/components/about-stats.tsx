import { useArchive } from "@repo/sdk";
import { Enter } from "@/components/motion/enter";
import { SectionSkeleton } from "@/features/about/components/section-skeleton";
import { SectionState } from "@/features/about/components/section-state";
import { Stat } from "@/features/about/components/stat";
import { daysSince } from "@/lib/format";

function AboutStats() {
  const query = useArchive();
  if (!query.data) {
    return (
      <SectionState
        status={query.isError ? "error" : "loading"}
        skeleton={<SectionSkeleton count={3} height={96} horizontal />}
        onRetry={() => query.refetch()}
      />
    );
  }
  const { fragmentCount, chapterCount, startedAt } = query.data;
  return (
    <Enter index={1} className="flex-row gap-4 pr-1">
      <Stat value={fragmentCount} label="fragmen" index={0} />
      <Stat value={chapterCount} label="babak" index={1} />
      <Stat value={daysSince(startedAt)} label="hari bersama" index={2} />
    </Enter>
  );
}

export { AboutStats };
