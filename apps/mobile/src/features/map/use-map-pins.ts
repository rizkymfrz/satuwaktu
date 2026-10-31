import { useMemo, useState } from "react";
import { fitRegion, groupPins, zoomToRegion } from "@/components/map/geo";
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
  const [initialRegion] = useState(() => {
    const target = focus
      ? fragments.find((fragment) => fragment.id === focus)?.location
      : null;
    if (target) {
      return zoomToRegion(target.latitude, target.longitude, 14);
    }
    return fitRegion(
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
    initialRegion,
    selectedPin,
    selectedFragment,
    noLocations,
  };
}

export { useMapPins };
