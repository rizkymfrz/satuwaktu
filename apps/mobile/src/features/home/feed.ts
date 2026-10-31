import type { Fragment } from "@/features/archive/types";
import type { StatKind } from "@/features/home/types";

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededRandom(seed: number, index: number) {
  return mulberry32(seed * 7919 + index * 104729)();
}

const STAT_CHANCE = 0.14;
const STAT_KINDS: StatKind[] = ["fragments", "likes", "days"];

type GridItem =
  | { type: "fragment"; fragment: Fragment }
  | { type: "stat"; kind: StatKind; key: string };

function buildItems(fragments: Fragment[], seed: number): GridItem[] {
  const items: GridItem[] = [];
  fragments.forEach((fragment, index) => {
    items.push({ type: "fragment", fragment });
    if (seededRandom(seed, index) < STAT_CHANCE) {
      const kindIndex = Math.floor(
        seededRandom(seed, index + 1000) * STAT_KINDS.length,
      );
      items.push({
        type: "stat",
        kind: STAT_KINDS[kindIndex],
        key: `stat-${seed}-${index}`,
      });
    }
  });
  return items;
}

function heightOf(item: GridItem, columnWidth: number) {
  return item.type === "fragment"
    ? columnWidth * item.fragment.aspect
    : columnWidth * 0.6;
}

export { buildItems, heightOf };
export type { GridItem };
