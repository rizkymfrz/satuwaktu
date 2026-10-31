import type { Fragment } from "@/features/archive/types";
import type { TimelineRowData } from "@/features/timeline/types";
import { formatMonthYear } from "@/lib/format";

type HeaderRow = Extract<TimelineRowData, { type: "header" }>;

function monthKey(date: string) {
  const parsed = new Date(date);
  return `${parsed.getFullYear()}-${parsed.getMonth()}`;
}

function groupByMonth(
  fragments: Fragment[],
  hasMore: boolean,
): TimelineRowData[] {
  const sorted = [...fragments].sort((a, b) =>
    b.takenAt.localeCompare(a.takenAt),
  );
  const counts = new Map<string, number>();
  sorted.forEach((fragment) => {
    const key = monthKey(fragment.takenAt);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  const rows: TimelineRowData[] = [];
  let currentKey = "";
  let lastHeader: HeaderRow | null = null;
  sorted.forEach((fragment) => {
    const key = monthKey(fragment.takenAt);
    if (key !== currentKey) {
      currentKey = key;
      lastHeader = {
        type: "header",
        key: `header-${key}`,
        label: formatMonthYear(fragment.takenAt),
        count: counts.get(key) ?? 0,
        partial: false,
      };
      rows.push(lastHeader);
    }
    rows.push({ type: "item", key: fragment.id, fragment });
  });
  if (hasMore && lastHeader) {
    (lastHeader as HeaderRow).partial = true;
  }
  return rows;
}

export { groupByMonth };
