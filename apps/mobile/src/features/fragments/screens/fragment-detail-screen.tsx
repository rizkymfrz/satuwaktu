import { useLocalSearchParams, useRouter } from "expo-router";
import { CircleHelp } from "lucide-react-native";
import { useState } from "react";
import {
  isApiError,
  useDeleteFragment,
  useFragment,
  useFragmentNeighbors,
  useLikeFragment,
  useUnlikeFragment,
  useUpdateFragment,
} from "@repo/sdk";
import { ConfirmDialog } from "@/components/layout/confirm-dialog";
import { EmptyState } from "@/components/layout/empty-state";
import { QueryError } from "@/components/layout/query-error";
import { Screen } from "@/components/layout/screen";
import { ScreenScroll } from "@/components/layout/screen-scroll";
import { toast } from "@/components/ui/sonner";
import { toFragment } from "@/features/archive/from-api";
import { FragmentHero } from "@/features/fragments/components/detail/fragment-hero";
import { FragmentSkeleton } from "@/features/fragments/components/detail/fragment-skeleton";
import { FragmentTitle } from "@/features/fragments/components/detail/fragment-title";
import { InfoCard } from "@/features/fragments/components/detail/info-card";
import { NeighborNav } from "@/features/fragments/components/detail/neighbor-nav";
import { OwnerActions } from "@/features/fragments/components/detail/owner-actions";
import { RelatedFragments } from "@/features/fragments/components/detail/related-fragments";
import { UploaderRow } from "@/features/fragments/components/detail/uploader-row";
import { FragmentNotes } from "@/features/fragments/components/notes/fragment-notes";
import { useSession } from "@/features/session/store";
import {
  KeyboardRevealContext,
  useKeyboardReveal,
} from "@/lib/keyboard-reveal";
import { Space } from "@/theme/space";

function FragmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    ref: scrollRef,
    reveal,
    bottomInset,
    scrollProps,
  } = useKeyboardReveal();
  const { role } = useSession();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const query = useFragment(id);
  const like = useLikeFragment();
  const unlike = useUnlikeFragment();
  const update = useUpdateFragment(id);
  const remove = useDeleteFragment();
  const neighbors = useFragmentNeighbors(id);
  const view = query.data;
  if (!view) {
    if (query.isPending) {
      return (
        <Screen title="Fragmen" back>
          <FragmentSkeleton />
        </Screen>
      );
    }
    if (isApiError(query.error) && query.error.status === 404) {
      return (
        <Screen title="Fragmen" back>
          <EmptyState fill icon={CircleHelp} title="Fragmen tidak ditemukan">
            Mungkin sudah dihapus atau tautannya keliru.
          </EmptyState>
        </Screen>
      );
    }
    return (
      <Screen title="Fragmen" back>
        <QueryError
          message="Tidak bisa memuat fragmen"
          onRetry={() => query.refetch()}
          fill
        />
      </Screen>
    );
  }
  const fragment = toFragment(view);
  const confirmRemove = () => {
    remove.mutate(fragment.id, {
      onSuccess: () => {
        router.back();
        toast.success("Fragmen dihapus.");
      },
      onError: () => toast.error("Gagal menghapus fragmen."),
    });
  };
  const togglePin = () => {
    update.mutate(
      { pinned: !fragment.pinned },
      {
        onSuccess: () =>
          toast.success(
            fragment.pinned
              ? "Sematan dilepas."
              : "Fragmen disematkan di beranda.",
          ),
        onError: () => toast.error("Gagal mengubah sematan."),
      },
    );
  };
  const toggleLike = () => {
    if (like.isPending || unlike.isPending) {
      return;
    }
    const mutation = view.likedByMe ? unlike : like;
    mutation.mutate(fragment.id, {
      onError: () => toast.error("Gagal memperbarui tanda suka."),
    });
  };
  const open = (target: string) =>
    router.replace({ pathname: "/fragments/[id]", params: { id: target } });
  return (
    <Screen title="Fragmen" back>
      <KeyboardRevealContext.Provider value={reveal}>
        <ScreenScroll
          ref={scrollRef}
          {...scrollProps}
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="gap-4 p-4"
          contentContainerStyle={{ paddingBottom: Space.xl + bottomInset }}
        >
          <FragmentHero fragment={fragment} />
          <FragmentTitle fragment={fragment} />
          <UploaderRow
            fragment={fragment}
            liked={view.likedByMe}
            onToggleLike={toggleLike}
          />
          {role === "owner" ? (
            <OwnerActions
              pinned={fragment.pinned}
              onTogglePin={togglePin}
              onEdit={() =>
                router.push({
                  pathname: "/fragments/new",
                  params: { id: fragment.id },
                })
              }
              onDelete={() => setConfirmDelete(true)}
            />
          ) : null}
          <InfoCard fragment={fragment} />
          <FragmentNotes fragmentId={fragment.id} total={view.comments} />
          <NeighborNav
            older={
              neighbors.data?.older
                ? toFragment(neighbors.data.older)
                : undefined
            }
            newer={
              neighbors.data?.newer
                ? toFragment(neighbors.data.newer)
                : undefined
            }
            onOpen={open}
          />
          {fragment.chapter ? (
            <RelatedFragments
              fragmentId={fragment.id}
              chapter={fragment.chapter}
              onOpen={open}
            />
          ) : null}
        </ScreenScroll>
      </KeyboardRevealContext.Provider>
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Hapus fragmen ini?"
        description="Foto, cerita, dan semua titipan kata di fragmen ini akan hilang dan tidak bisa dikembalikan."
        confirmLabel="Hapus"
        destructive
        onConfirm={confirmRemove}
      />
    </Screen>
  );
}

export { FragmentDetailScreen };
