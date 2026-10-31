import { useMemo, useState } from "react";
import { fitView, focusView, groupPins } from "@/components/map/geo";
import type { Fragment } from "@/features/archive/types";

function useMapPins(fragments: Fragment[], focus: string | undefined) {
  const [chapter, setChapter] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const located = useMemo(
    () =>
      chapter
        ? fragments.filter((fragment) => fragment.chapter?.id === chapter)
        : fragments,
    [fragments, chapter],
  );
  const pins = useMemo(() => groupPins(located), [located]);
  const [initialView] = useState(() => {
    const target = focus
      ? fragments.find((fragment) => fragment.id === focus)?.location
      : null;
    if (target) {
      return focusView(target.latitude, target.longitude);
    }
    return fitView(
      fragments.flatMap((fragment) =>
        fragment.location ? [fragment.location] : [],
      ),
    );
  });
  const selectedPin =
    pins.find((pin) =>
      pin.fragments.some((fragment) => fragment.id === selectedId),
    ) ?? null;
  const selectedFragment =
    selectedPin?.fragments.find((fragment) => fragment.id === selectedId) ??
    null;
  const noLocations = fragments.length === 0;
  return {
    chapter,
    setChapter,
    setSelectedId,
    located,
    pins,
    initialView,
    selectedPin,
    selectedFragment,
    noLocations,
  };
}

export { useMapPins };
