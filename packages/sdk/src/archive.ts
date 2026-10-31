import type { AxiosInstance } from "axios";
import type { ArchiveView } from "@repo/dto";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "./provider.js";

export const archiveKeys = {
  all: ["archive"] as const,
};

export async function getArchive(http: AxiosInstance, signal?: AbortSignal) {
  const { data } = await http.get<ArchiveView>("archive", { signal });
  return data;
}

export async function recordVisit(http: AxiosInstance) {
  const { data } = await http.post<ArchiveView>("archive/visits");
  return data;
}

export function useArchive() {
  const { http } = useApiClient();
  return useQuery({
    queryKey: archiveKeys.all,
    queryFn: ({ signal }) => getArchive(http, signal),
  });
}

export function useRecordVisit() {
  const { http } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => recordVisit(http),
    onSuccess: (archive) => {
      queryClient.setQueryData(archiveKeys.all, archive);
    },
  });
}
