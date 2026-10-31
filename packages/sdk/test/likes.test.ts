import type { FragmentPage, FragmentView } from "@repo/dto";
import { QueryClient, type InfiniteData } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import { archiveKeys } from "../src/archive.js";
import { chapterKeys } from "../src/chapters.js";
import { fragmentKeys } from "../src/fragments.js";
import {
  applyLikeState,
  applyOptimisticLike,
  predictLikeState,
} from "../src/likes.js";
import { profileKeys } from "../src/profile.js";

function fragment(id: string): FragmentView {
  return {
    id,
    caption: "",
    takenAt: "2025-01-01T00:00:00.000Z",
    visibility: "PUBLIC",
    pinned: false,
    photoUrl: null,
    aspect: 1,
    location: null,
    song: null,
    chapter: null,
    uploader: { id: "u", name: "u" },
    likes: 1,
    likedByMe: false,
    comments: 0,
    createdAt: "2025-01-01T00:00:00.000Z",
  };
}

function list(): InfiniteData<FragmentPage> {
  return {
    pageParams: [undefined],
    pages: [
      { items: [fragment("a"), fragment("b")], nextCursor: "next" },
      { items: [fragment("c")], nextCursor: null },
    ],
  };
}

describe("applyLikeState", () => {
  it("patches the detail cache and every cached list for the liked fragment", async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(fragmentKeys.detail("b"), fragment("b"));
    queryClient.setQueryData(fragmentKeys.list({}), list());
    queryClient.setQueryData(fragmentKeys.list({ chapterId: "x" }), list());
    await applyLikeState(queryClient, "b", { liked: true, likes: 5 });
    expect(
      queryClient.getQueryData<FragmentView>(fragmentKeys.detail("b")),
    ).toMatchObject({ likes: 5, likedByMe: true });
    for (const filters of [{}, { chapterId: "x" }]) {
      const data = queryClient.getQueryData<InfiniteData<FragmentPage>>(
        fragmentKeys.list(filters),
      );
      const items = data?.pages.flatMap((page) => page.items) ?? [];
      expect(items.find((item) => item.id === "b")).toMatchObject({
        likes: 5,
        likedByMe: true,
      });
      expect(items.find((item) => item.id === "a")).toMatchObject({
        likes: 1,
        likedByMe: false,
      });
    }
  });

  it("leaves a missing detail entry absent", async () => {
    const queryClient = new QueryClient();
    await applyLikeState(queryClient, "z", { liked: true, likes: 2 });
    expect(queryClient.getQueryData(fragmentKeys.detail("z"))).toBeUndefined();
  });

  it("marks chapter, archive and profile data stale without touching fragment queries", async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(chapterKeys.all, []);
    queryClient.setQueryData(archiveKeys.all, {});
    queryClient.setQueryData(profileKeys.stats(), {});
    queryClient.setQueryData(fragmentKeys.list({}), list());
    await applyLikeState(queryClient, "a", { liked: false, likes: 0 });
    expect(queryClient.getQueryState(chapterKeys.all)?.isInvalidated).toBe(
      true,
    );
    expect(queryClient.getQueryState(archiveKeys.all)?.isInvalidated).toBe(
      true,
    );
    expect(queryClient.getQueryState(profileKeys.stats())?.isInvalidated).toBe(
      true,
    );
    expect(
      queryClient.getQueryState(fragmentKeys.list({}))?.isInvalidated,
    ).toBe(false);
  });
});

describe("predictLikeState", () => {
  it("adds one like when liking a fragment that was not liked", () => {
    expect(predictLikeState({ likes: 3, likedByMe: false }, true)).toEqual({
      liked: true,
      likes: 4,
    });
  });

  it("removes one like when unliking a liked fragment", () => {
    expect(predictLikeState({ likes: 3, likedByMe: true }, false)).toEqual({
      liked: false,
      likes: 2,
    });
  });

  it("does not change the count when the state already matches", () => {
    expect(predictLikeState({ likes: 3, likedByMe: true }, true)).toEqual({
      liked: true,
      likes: 3,
    });
    expect(predictLikeState({ likes: 0, likedByMe: false }, false)).toEqual({
      liked: false,
      likes: 0,
    });
  });
});

describe("applyOptimisticLike", () => {
  it("flips the detail cache and cached lists before the server answers", async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(fragmentKeys.detail("b"), fragment("b"));
    queryClient.setQueryData(fragmentKeys.list({}), list());
    await applyOptimisticLike(queryClient, "b", true);
    expect(
      queryClient.getQueryData<FragmentView>(fragmentKeys.detail("b")),
    ).toMatchObject({ likes: 2, likedByMe: true });
    const data = queryClient.getQueryData<InfiniteData<FragmentPage>>(
      fragmentKeys.list({}),
    );
    expect(
      data?.pages.flatMap((page) => page.items).find((i) => i.id === "b"),
    ).toMatchObject({ likes: 2, likedByMe: true });
  });

  it("does nothing when the fragment detail is not cached", async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(fragmentKeys.list({}), list());
    await applyOptimisticLike(queryClient, "b", true);
    const data = queryClient.getQueryData<InfiniteData<FragmentPage>>(
      fragmentKeys.list({}),
    );
    expect(
      data?.pages.flatMap((page) => page.items).find((i) => i.id === "b"),
    ).toMatchObject({ likes: 1, likedByMe: false });
  });
});
