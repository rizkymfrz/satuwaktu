import { CircleHelp } from "lucide-react-native";
import { useMemo } from "react";
import { View } from "react-native";
import { isApiError, useFragment, useUpdateFragment } from "@repo/sdk";
import { EmptyState } from "@/components/layout/empty-state";
import { QueryError } from "@/components/layout/query-error";
import { Screen } from "@/components/layout/screen";
import { toast } from "@/components/ui/sonner";
import { Spinner } from "@/components/ui/spinner";
import { TypographyMuted } from "@/components/ui/typography";
import { toFragment } from "@/features/archive/from-api";
import { useChapterOptions } from "@/features/archive/use-chapter-options";
import { saveErrorMessage } from "@/features/fragments/save-error";
import {
  FragmentFormScreen,
  type FragmentFormValues,
} from "@/features/fragments/screens/fragment-form-screen";
import { usePhotoUpload } from "@/features/fragments/use-photo-upload";

function EditFragmentScreen({ id }: { id: string }) {
  const query = useFragment(id);
  const { chapters, createChapter } = useChapterOptions();
  const update = useUpdateFragment(id);
  const uploadPhoto = usePhotoUpload();
  const editing = useMemo(
    () => (query.data ? toFragment(query.data) : undefined),
    [query.data],
  );
  if (!editing) {
    return (
      <Screen title="Edit fragmen" back>
        {query.isPending ? (
          <View className="flex-1 items-center justify-center gap-2">
            <Spinner size={28} />
            <TypographyMuted>Memuat fragmen…</TypographyMuted>
          </View>
        ) : isApiError(query.error) && query.error.status === 404 ? (
          <EmptyState fill icon={CircleHelp} title="Fragmen ini tak ditemukan">
            Mungkin sudah dihapus atau tautannya keliru.
          </EmptyState>
        ) : (
          <QueryError
            message="Tidak bisa memuat fragmen"
            onRetry={() => query.refetch()}
            fill
          />
        )}
      </Screen>
    );
  }
  const submit = async (values: FragmentFormValues) => {
    try {
      const photoUrl =
        values.photoUri && values.photoUri !== editing.photoUrl
          ? await uploadPhoto(values.photoUri)
          : undefined;
      await update.mutateAsync({
        caption: values.caption,
        takenAt: values.takenAt.toISOString(),
        visibility: values.visibility,
        chapterId: values.chapterId,
        location: values.location,
        song: values.song,
        ...(photoUrl ? { photoUrl } : {}),
      });
      toast.success("Perubahan tersimpan.");
    } catch (error) {
      toast.error(saveErrorMessage(error, "Gagal menyimpan perubahan."));
      throw error;
    }
  };
  return (
    <FragmentFormScreen
      editing={editing}
      chapters={chapters}
      onCreateChapter={createChapter}
      onSubmit={submit}
    />
  );
}

export { EditFragmentScreen };
