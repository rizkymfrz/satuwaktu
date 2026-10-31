import type { AxiosInstance } from "axios";
import type { HealthView } from "@repo/dto";
import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./provider.js";

export const healthKeys = {
  all: ["health"] as const,
};

export async function getHealth(http: AxiosInstance, signal?: AbortSignal) {
  const { data } = await http.get<HealthView>("health", { signal });
  return data;
}

export function useHealth() {
  const { http } = useApiClient();
  return useQuery({
    queryKey: healthKeys.all,
    queryFn: ({ signal }) => getHealth(http, signal),
  });
}
