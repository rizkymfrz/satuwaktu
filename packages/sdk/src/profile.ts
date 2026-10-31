import type { AxiosInstance } from "axios";
import type { ProfileStatsView } from "@repo/dto";
import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./provider.js";

export const profileKeys = {
  all: ["profile"] as const,
  stats: () => [...profileKeys.all, "stats"] as const,
};

export async function getProfileStats(
  http: AxiosInstance,
  signal?: AbortSignal,
) {
  const { data } = await http.get<ProfileStatsView>("profile/stats", {
    signal,
  });
  return data;
}

export function useProfileStats() {
  const { http } = useApiClient();
  return useQuery({
    queryKey: profileKeys.stats(),
    queryFn: ({ signal }) => getProfileStats(http, signal),
  });
}
