import { useMemo } from "react";
import { View } from "react-native";
import { MAX_PAGE_SIZE } from "@repo/dto";
import { useArchive, useChapters } from "@repo/sdk";
import { QueryError } from "@/components/layout/query-error";
import { Enter } from "@/components/motion/enter";
import { TypographyH4 } from "@/components/ui/typography";
import {
  JourneyRow,
  type Milestone,
} from "@/features/about/components/journey-row";
import { SectionSkeleton } from "@/features/about/components/section-skeleton";
import { SectionState } from "@/features/about/components/section-state";
import {
  groupByChapter,
  NO_CHAPTER_ID,
} from "@/features/archive/fragment-utils";
import { useAllFragments } from "@/features/archive/use-all-fragments";
import { formatDate, formatRange } from "@/lib/format";

function JourneySection() {
  const all = useAllFragments({ limit: MAX_PAGE_SIZE });
  const chaptersQuery = useChapters();
  const archiveQuery = useArchive();
  const { fragments } = all;
  const chapters = chaptersQuery.data;
  const startedAt = archiveQuery.data?.startedAt;
  const milestones = useMemo<Milestone[]>(() => {
    if (!chapters || !startedAt) {
      return [];
    }
    const chapterMilestones = groupByChapter(fragments, chapters)
      .filter((group) => group.id !== NO_CHAPTER_ID)
      .sort((a, b) => a.from.localeCompare(b.from))
      .map((group) => ({
        key: group.id,
        title: group.name,
        meta: `${formatRange(group.from, group.to)} · ${group.fragments.length} fragmen`,
        note: group.fragments[group.fragments.length - 1]?.caption || undefined,
        photos: [...group.fragments].reverse().slice(0, 3),
      }));
    const first = [...fragments].sort((a, b) =>
      a.takenAt.localeCompare(b.takenAt),
    )[0];
    return [
      {
        key: "mulai",
        title: "Mula-mula",
        meta: formatDate(startedAt),
        note: "Hari pertama fragmen itu dikumpulkan, pelan-pelan, tanpa rencana.",
        photos: first ? [first] : [],
      },
      ...chapterMilestones,
    ];
  }, [fragments, chapters, startedAt]);
  const failed =
    all.status === "error" ||
    (chaptersQuery.isError && !chapters) ||
    (archiveQuery.isError && !startedAt);
  const ready = all.status === "ready" && !!chapters && !!startedAt;
  const retry = () => {
    if (all.status === "error") {
      all.retry();
    }
    if (chaptersQuery.isError && !chapters) {
      void chaptersQuery.refetch();
    }
    if (archiveQuery.isError && !startedAt) {
      void archiveQuery.refetch();
    }
  };
  return (
    <View className="gap-4">
      <TypographyH4 className="font-head">Jejak yang tertinggal</TypographyH4>
      {failed || !ready ? (
        <SectionState
          status={failed ? "error" : "loading"}
          skeleton={<SectionSkeleton count={3} height={160} />}
          onRetry={retry}
        />
      ) : (
        <>
          {all.incomplete ? (
            <QueryError
              message="Sebagian fragmen belum termuat."
              onRetry={all.retry}
            />
          ) : null}
          <View className="pr-1">
            {milestones.map((milestone, index) => (
              <Enter key={milestone.key} index={index}>
                <JourneyRow
                  milestone={milestone}
                  index={index}
                  last={index === milestones.length - 1}
                />
              </Enter>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

export { JourneySection };
