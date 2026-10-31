import type { AxiosInstance } from "axios";
import type {
  CreateFragmentParams,
  FragmentNeighborsView,
  FragmentPage,
  FragmentView,
  ListFragmentsParams,
  OnThisDayView,
  UpdateFragmentParams,
} from "@repo/dto";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { archiveKeys } from "./archive.js";
import { chapterKeys } from "./chapters.js";
import { profileKeys } from "./profile.js";
import { useApiClient } from "./provider.js";

export type FragmentFilters = Omit<ListFragmentsParams, "cursor">;

export const fragmentKeys = {
  all: ["fragments"] as const,
  lists: () => [...fragmentKeys.all, "list"] as const,
  list: (filters: FragmentFilters) =>
    [...fragmentKeys.lists(), filters] as const,
  detail: (id: string) => [...fragmentKeys.all, "detail", id] as const,
  onThisDay: () => [...fragmentKeys.all, "on-this-day"] as const,
  neighbors: (id: string) => [...fragmentKeys.all, "neighbors", id] as const,
};

export async function listFragments(
  http: AxiosInstance,
  params: ListFragmentsParams,
  signal?: AbortSignal,
) {
  const { data } = await http.get<FragmentPage>("fragments", {
    params,
    signal,
  });
  return data;
}

export async function getOnThisDay(http: AxiosInstance, signal?: AbortSignal) {
  const { data } = await http.get<OnThisDayView>("fragments/on-this-day", {
    signal,
  });
  return data;
}

export async function getFragment(
  http: AxiosInstance,
  id: string,
  signal?: AbortSignal,
) {
  const { data } = await http.get<FragmentView>(
    `fragments/${encodeURIComponent(id)}`,
    { signal },
  );
  return data;
}

export async function getFragmentNeighbors(
  http: AxiosInstance,
  id: string,
  signal?: AbortSignal,
) {
  const { data } = await http.get<FragmentNeighborsView>(
    `fragments/${encodeURIComponent(id)}/neighbors`,
    { signal },
  );
  return data;
}

export async function createFragment(
  http: AxiosInstance,
  body: CreateFragmentParams,
) {
  const { data } = await http.post<FragmentView>("fragments", body);
  return data;
}

export async function updateFragment(
  http: AxiosInstance,
  id: string,
  body: UpdateFragmentParams,
) {
  const { data } = await http.patch<FragmentView>(
    `fragments/${encodeURIComponent(id)}`,
    body,
  );
  return data;
}

export async function deleteFragment(http: AxiosInstance, id: string) {
  await http.delete(`fragments/${encodeURIComponent(id)}`);
}

export function invalidateFragmentData(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: fragmentKeys.all }),
    queryClient.invalidateQueries({ queryKey: chapterKeys.all }),
    queryClient.invalidateQueries({ queryKey: archiveKeys.all }),
    queryClient.invalidateQueries({ queryKey: profileKeys.all }),
  ]);
}

export function useFragments(filters: FragmentFilters = {}) {
  const { http } = useApiClient();
  return useInfiniteQuery({
    queryKey: fragmentKeys.list(filters),
    queryFn: ({ pageParam, signal }) =>
      listFragments(http, { ...filters, cursor: pageParam }, signal),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
}

export function useOnThisDay() {
  const { http } = useApiClient();
  return useQuery({
    queryKey: fragmentKeys.onThisDay(),
    queryFn: ({ signal }) => getOnThisDay(http, signal),
  });
}

export function useFragment(id: string) {
  const { http } = useApiClient();
  return useQuery({
    queryKey: fragmentKeys.detail(id),
    queryFn: ({ signal }) => getFragment(http, id, signal),
  });
}

export function useFragmentNeighbors(id: string) {
  const { http } = useApiClient();
  return useQuery({
    queryKey: fragmentKeys.neighbors(id),
    queryFn: ({ signal }) => getFragmentNeighbors(http, id, signal),
  });
}

export function useCreateFragment() {
  const { http } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateFragmentParams) => createFragment(http, body),
    onSuccess: () => invalidateFragmentData(queryClient),
  });
}

export function useUpdateFragment(id: string) {
  const { http } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateFragmentParams) => updateFragment(http, id, body),
    onSuccess: () => invalidateFragmentData(queryClient),
  });
}

export function useDeleteFragment() {
  const { http } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFragment(http, id),
    onSuccess: () => invalidateFragmentData(queryClient),
  });
}
