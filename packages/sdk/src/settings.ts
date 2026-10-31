import type { AxiosInstance } from "axios";
import type { SettingsView, UpdateSettingsParams } from "@repo/dto";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "./provider.js";

export const settingsKeys = {
  all: ["settings"] as const,
};

export async function getSettings(http: AxiosInstance, signal?: AbortSignal) {
  const { data } = await http.get<SettingsView>("settings", { signal });
  return data;
}

export async function updateSettings(
  http: AxiosInstance,
  body: UpdateSettingsParams,
) {
  const { data } = await http.patch<SettingsView>("settings", body);
  return data;
}

export function useSettings({ enabled = true }: { enabled?: boolean } = {}) {
  const { http } = useApiClient();
  return useQuery({
    queryKey: settingsKeys.all,
    queryFn: ({ signal }) => getSettings(http, signal),
    enabled,
  });
}

export function useUpdateSettings() {
  const { http } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateSettingsParams) => updateSettings(http, body),
    onSuccess: (settings) => {
      queryClient.setQueryData(settingsKeys.all, settings);
    },
  });
}
