import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { useCreateFragment } from "@repo/sdk";
import { QueryError } from "@/components/layout/query-error";
import { Screen } from "@/components/layout/screen";
import { toast } from "@/components/ui/sonner";
import { Spinner } from "@/components/ui/spinner";
import { TypographyMuted } from "@/components/ui/typography";
import { useChapterOptions } from "@/features/archive/use-chapter-options";
import { saveErrorMessage } from "@/features/fragments/save-error";
import { EditFragmentScreen } from "@/features/fragments/screens/edit-fragment-screen";
import {
  FragmentFormScreen,
  type FragmentFormValues,
} from "@/features/fragments/screens/fragment-form-screen";
import { usePhotoUpload } from "@/features/fragments/use-photo-upload";
import { useSettings } from "@/features/settings/store";

function CreateFragmentScreen() {
  const { chapters, createChapter } = useChapterOptions();
  const create = useCreateFragment();
  const uploadPhoto = usePhotoUpload();
  const { status, retry } = useSettings();
  const submit = async (values: FragmentFormValues) => {
    try {
      const photoUrl = values.photoUri
        ? await uploadPhoto(values.photoUri)
        : undefined;
      await create.mutateAsync({
        caption: values.caption,
        takenAt: values.takenAt.toISOString(),
        visibility: values.visibility,
        chapterId: values.chapterId,
        location: values.location,
        song: values.song,
        ...(photoUrl ? { photoUrl } : {}),
      });
      toast.success("Fragmen tersimpan di arsip.");
    } catch (error) {
      toast.error(saveErrorMessage(error, "Gagal menyimpan fragmen."));
      throw error;
    }
  };
  if (status !== "ready") {
    return (
      <Screen title="Abadikan" back>
        {status === "loading" ? (
          <View className="flex-1 items-center justify-center gap-2">
            <Spinner size={28} />
            <TypographyMuted>Memuat pengaturan…</TypographyMuted>
          </View>
        ) : (
          <QueryError
            message="Tidak bisa memuat pengaturan"
            onRetry={retry}
            fill
          />
        )}
      </Screen>
    );
  }
  return (
    <FragmentFormScreen
      editing={undefined}
      chapters={chapters}
      onCreateChapter={createChapter}
      onSubmit={submit}
    />
  );
}

function NewFragmentScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return id ? <EditFragmentScreen id={id} /> : <CreateFragmentScreen />;
}

export { NewFragmentScreen };
