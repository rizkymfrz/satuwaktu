import { useMemo } from "react";
import { useFragments, type FragmentFilters } from "@repo/sdk";
import { toFragment } from "@/features/archive/from-api";

function useFragmentList(filters?: FragmentFilters) {
  const query = useFragments(filters);
  const fragments = useMemo(
    () => query.data?.pages.flatMap((page) => page.items).map(toFragment) ?? [],
    [query.data],
  );
  return { query, fragments };
}

export { useFragmentList };
