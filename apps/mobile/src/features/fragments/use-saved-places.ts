import { useMemo } from "react";
import { MAX_PAGE_SIZE } from "@repo/dto";
import type { Location } from "@/features/archive/types";
import { useFragmentList } from "@/features/archive/use-fragment-list";

const MAX_SAVED_PLACES = 5;
const COORDINATE_PRECISION = 5;

function placeKey({ latitude, longitude, name }: Location) {
  return `${latitude.toFixed(COORDINATE_PRECISION)},${longitude.toFixed(COORDINATE_PRECISION)}|${name}`;
}

function useSavedPlaces(current: Location | null) {
  const { fragments } = useFragmentList({
    hasLocation: true,
    limit: MAX_PAGE_SIZE,
  });
  return useMemo(() => {
    const currentKey = current ? placeKey(current) : null;
    const places = new Map<string, Location>();
    for (const { location } of fragments) {
      if (!location || !Number.isFinite(location.latitude)) {
        continue;
      }
      const key = placeKey(location);
      if (key !== currentKey && !places.has(key)) {
        places.set(key, location);
      }
    }
    return [...places.values()].slice(0, MAX_SAVED_PLACES);
  }, [fragments, current]);
}

export { useSavedPlaces };
