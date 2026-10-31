import { useMemo } from "react";
import { MAX_PAGE_SIZE } from "@repo/dto";
import type { Fragment } from "@/features/archive/types";
import { useAllFragments } from "@/features/archive/use-all-fragments";

const MAX_LATITUDE = 90;
const MAX_LONGITUDE = 180;

function hasValidLocation({ location }: Fragment) {
  return (
    !!location &&
    Number.isFinite(location.latitude) &&
    Number.isFinite(location.longitude) &&
    Math.abs(location.latitude) <= MAX_LATITUDE &&
    Math.abs(location.longitude) <= MAX_LONGITUDE
  );
}

function useLocatedFragments() {
  const { fragments, ...rest } = useAllFragments({
    hasLocation: true,
    limit: MAX_PAGE_SIZE,
  });
  const located = useMemo(
    () => fragments.filter(hasValidLocation),
    [fragments],
  );
  return { fragments: located, ...rest };
}

export { useLocatedFragments };
