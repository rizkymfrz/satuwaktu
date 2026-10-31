import type { AxiosInstance } from "axios";
import type { ChapterView, CreateChapterParams } from "@repo/dto";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { archiveKeys } from "./archive.js";
import { useApiClient } from "./provider.js";

export const chapterKeys = {
  all: ["chapters"] as const,
};

export async function listChapters(http: AxiosInstance, signal?: AbortSignal) {
  const { data } = await http.get<ChapterView[]>("chapters", { signal });
  return data;
}

export async function createChapter(
  http: AxiosInstance,
  body: CreateChapterParams,
) {
  const { data } = await http.post<ChapterView>("chapters", body);
  return data;
}

export function useChapters() {
  const { http } = useApiClient();
  return useQuery({
    queryKey: chapterKeys.all,
    queryFn: ({ signal }) => listChapters(http, signal),
  });
}

export function useCreateChapter() {
  const { http } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateChapterParams) => createChapter(http, body),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: chapterKeys.all }),
        queryClient.invalidateQueries({ queryKey: archiveKeys.all }),
      ]),
  });
}
