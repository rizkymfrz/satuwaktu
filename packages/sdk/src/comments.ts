import type { AxiosInstance } from "axios";
import type {
  CommentPage,
  CommentView,
  CreateCommentParams,
  CreateReplyParams,
  ListCommentsParams,
  ReplyView,
} from "@repo/dto";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { fragmentKeys } from "./fragments.js";
import { profileKeys } from "./profile.js";
import { useApiClient } from "./provider.js";

export type CommentFilters = Omit<ListCommentsParams, "cursor">;

export const commentKeys = {
  all: ["comments"] as const,
  lists: (fragmentId: string) =>
    [...commentKeys.all, "list", fragmentId] as const,
  list: (fragmentId: string, filters: CommentFilters) =>
    [...commentKeys.lists(fragmentId), filters] as const,
};

export async function listComments(
  http: AxiosInstance,
  fragmentId: string,
  params: ListCommentsParams,
  signal?: AbortSignal,
) {
  const { data } = await http.get<CommentPage>(
    `fragments/${encodeURIComponent(fragmentId)}/comments`,
    { params, signal },
  );
  return data;
}

export async function createComment(
  http: AxiosInstance,
  fragmentId: string,
  body: CreateCommentParams,
) {
  const { data } = await http.post<CommentView>(
    `fragments/${encodeURIComponent(fragmentId)}/comments`,
    body,
  );
  return data;
}

export async function replyToComment(
  http: AxiosInstance,
  commentId: string,
  body: CreateReplyParams,
) {
  const { data } = await http.post<ReplyView>(
    `comments/${encodeURIComponent(commentId)}/replies`,
    body,
  );
  return data;
}

export function useComments(fragmentId: string, filters: CommentFilters = {}) {
  const { http } = useApiClient();
  return useInfiniteQuery({
    queryKey: commentKeys.list(fragmentId, filters),
    queryFn: ({ pageParam, signal }) =>
      listComments(http, fragmentId, { ...filters, cursor: pageParam }, signal),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
}

export function useCreateComment(fragmentId: string) {
  const { http } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateCommentParams) =>
      createComment(http, fragmentId, body),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: commentKeys.lists(fragmentId),
        }),
        queryClient.invalidateQueries({ queryKey: fragmentKeys.all }),
        queryClient.invalidateQueries({ queryKey: profileKeys.all }),
      ]),
  });
}

export function useReplyToComment() {
  const { http } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      commentId,
      body,
    }: {
      commentId: string;
      body: CreateReplyParams;
    }) => replyToComment(http, commentId, body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: commentKeys.all }),
  });
}
