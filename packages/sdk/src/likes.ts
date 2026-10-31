import type { AxiosInstance } from "axios";
import type { FragmentPage, FragmentView, LikeState } from "@repo/dto";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
  type QueryClient,
} from "@tanstack/react-query";
import { archiveKeys } from "./archive.js";
import { chapterKeys } from "./chapters.js";
import { fragmentKeys } from "./fragments.js";
import { profileKeys } from "./profile.js";
import { useApiClient } from "./provider.js";

export async function likeFragment(http: AxiosInstance, fragmentId: string) {
  const { data } = await http.put<LikeState>(
    `fragments/${encodeURIComponent(fragmentId)}/like`,
  );
  return data;
}

export async function unlikeFragment(http: AxiosInstance, fragmentId: string) {
  const { data } = await http.delete<LikeState>(
    `fragments/${encodeURIComponent(fragmentId)}/like`,
  );
  return data;
}

function withLikeState(
  view: FragmentView,
  fragmentId: string,
  state: LikeState,
) {
  return view.id === fragmentId
    ? { ...view, likes: state.likes, likedByMe: state.liked }
    : view;
}

export function predictLikeState(
  view: Pick<FragmentView, "likes" | "likedByMe">,
  liked: boolean,
): LikeState {
  if (view.likedByMe === liked) {
    return { liked, likes: view.likes };
  }
  return { liked, likes: Math.max(0, view.likes + (liked ? 1 : -1)) };
}

function patchLikeState(
  queryClient: QueryClient,
  fragmentId: string,
  state: LikeState,
) {
  queryClient.setQueryData<FragmentView>(
    fragmentKeys.detail(fragmentId),
    (view) => view && withLikeState(view, fragmentId, state),
  );
  queryClient.setQueriesData<InfiniteData<FragmentPage>>(
    { queryKey: fragmentKeys.lists() },
    (data) =>
      data && {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          items: page.items.map((item) =>
            withLikeState(item, fragmentId, state),
          ),
        })),
      },
  );
}

export async function applyOptimisticLike(
  queryClient: QueryClient,
  fragmentId: string,
  liked: boolean,
) {
  await queryClient.cancelQueries({ queryKey: fragmentKeys.all });
  const view = queryClient.getQueryData<FragmentView>(
    fragmentKeys.detail(fragmentId),
  );
  if (view) {
    patchLikeState(queryClient, fragmentId, predictLikeState(view, liked));
  }
}

export function applyLikeState(
  queryClient: QueryClient,
  fragmentId: string,
  state: LikeState,
) {
  patchLikeState(queryClient, fragmentId, state);
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: chapterKeys.all }),
    queryClient.invalidateQueries({ queryKey: archiveKeys.all }),
    queryClient.invalidateQueries({ queryKey: profileKeys.all }),
  ]);
}

function useSetLiked(liked: boolean) {
  const { http } = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fragmentId: string) =>
      liked ? likeFragment(http, fragmentId) : unlikeFragment(http, fragmentId),
    onMutate: (fragmentId) =>
      applyOptimisticLike(queryClient, fragmentId, liked),
    onError: () =>
      queryClient.invalidateQueries({ queryKey: fragmentKeys.all }),
    onSuccess: (state, fragmentId) =>
      applyLikeState(queryClient, fragmentId, state),
  });
}

export function useLikeFragment() {
  return useSetLiked(true);
}

export function useUnlikeFragment() {
  return useSetLiked(false);
}
