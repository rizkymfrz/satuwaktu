import { useEffect, useState } from "react";
import type { FragmentFilters } from "@repo/sdk";
import { useFragmentList } from "@/features/archive/use-fragment-list";

type AllFragmentsStatus = "loading" | "error" | "ready";

function useAllFragments(filters: FragmentFilters) {
  const { query, fragments } = useFragmentList(filters);
  const { hasNextPage, isFetchingNextPage, isFetchNextPageError } = query;
  const { fetchNextPage, refetch } = query;
  const [loadedOnce, setLoadedOnce] = useState(false);
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage && !isFetchNextPageError) {
      void fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage]);
  const complete = !!query.data && (!hasNextPage || isFetchNextPageError);
  if (complete && !loadedOnce) {
    setLoadedOnce(true);
  }
  const status: AllFragmentsStatus =
    query.isError && !query.data
      ? "error"
      : loadedOnce || complete
        ? "ready"
        : "loading";
  return {
    fragments,
    status,
    incomplete: isFetchNextPageError,
    retry: () => {
      void (isFetchNextPageError ? fetchNextPage() : refetch());
    },
  };
}

export { useAllFragments };
export type { AllFragmentsStatus };
