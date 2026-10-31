import { useRouter } from "expo-router";
import { Clock, MapPin, Music } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { ConfirmDialog } from "@/components/layout/confirm-dialog";
import { Screen } from "@/components/layout/screen";
import { LocationPicker } from "@/components/map/location-picker";
import { TypographyMuted } from "@/components/ui/typography";
import type {
  ChapterRef,
  Fragment,
  Song,
  Visibility,
} from "@/features/archive/types";
import { CaptionSection } from "@/features/fragments/components/form/caption-section";
import { ChapterSection } from "@/features/fragments/components/form/chapter-section";
import { CollapsibleSection } from "@/features/fragments/components/form/collapsible-section";
import { FormFooter } from "@/features/fragments/components/form/form-footer";
import {
  FormProgress,
  type ProgressStep,
} from "@/features/fragments/components/form/form-progress";
import { LocationSection } from "@/features/fragments/components/form/location-section";
import { PhotoSection } from "@/features/fragments/components/form/photo-section";
import { SongSection } from "@/features/fragments/components/form/song-section";
import { TakenAtSection } from "@/features/fragments/components/form/taken-at-section";
import { VisibilitySection } from "@/features/fragments/components/form/visibility-section";
import { SongPicker } from "@/features/fragments/components/song/song-picker";
import { setLocationDraft } from "@/features/fragments/location-draft";
import { useFragmentForm } from "@/features/fragments/use-fragment-form";
import { useSavedPlaces } from "@/features/fragments/use-saved-places";
import { formatLongDate, formatTime } from "@/lib/format";
import {
  KeyboardRevealContext,
  useKeyboardReveal,
} from "@/lib/keyboard-reveal";
import { Space } from "@/theme/space";

type FragmentFormValues = {
  caption: string;
  chapterId: string | null;
  visibility: Visibility;
  photoUri: string | null;
  takenAt: Date;
  location: { latitude: number; longitude: number; name: string } | null;
  song: Song | null;
};

function FragmentFormScreen({
  editing,
  chapters,
  onCreateChapter,
  onSubmit,
}: {
  editing: Fragment | undefined;
  chapters: ChapterRef[];
  onCreateChapter: (name: string) => Promise<ChapterRef | null>;
  onSubmit: (values: FragmentFormValues) => Promise<void>;
}) {
  const router = useRouter();
  const {
    ref: scrollRef,
    reveal,
    bottomInset,
    scrollProps,
  } = useKeyboardReveal();
  const {
    caption,
    setCaption,
    chapterId,
    setChapterId,
    visibility,
    setVisibility,
    photoUri,
    takenAt,
    setTakenAt,
    photoRatio,
    photoHasNoGps,
    placeName,
    setPlaceName,
    saving,
    setSaving,
    song,
    setSong,
    location,
    hasPhoto,
    canSave,
    current,
    dirty,
    pickPhoto,
    removePhoto,
    clearLocation,
    applyPlace,
  } = useFragmentForm(editing);
  const savedPlaces = useSavedPlaces(current);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [songPickerOpen, setSongPickerOpen] = useState(false);
  const pickDay = (day: Date | undefined) => {
    if (!day) {
      return;
    }
    const next = new Date(takenAt);
    next.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());
    setTakenAt(next > new Date() ? new Date() : next);
    setCalendarOpen(false);
  };
  const pickTime = (hours: number, minutes: number) => {
    const next = new Date(takenAt);
    next.setHours(hours, minutes, 0, 0);
    setTakenAt(next > new Date() ? new Date() : next);
  };
  const takenAtIso = takenAt.toISOString();
  const locationSummary = location
    ? placeName.trim() ||
      `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
    : "Belum dipilih";
  const steps: ProgressStep[] = [
    { label: "Foto", done: hasPhoto },
    { label: "Cerita", done: caption.trim().length > 0 },
    { label: "Babak", done: chapterId !== null },
    { label: "Lagu", done: song !== null },
    { label: "Lokasi", done: location !== null },
  ];
  const cancel = () => {
    if (dirty) {
      setConfirmDiscard(true);
      return;
    }
    router.back();
  };
  const save = async () => {
    if (!canSave) {
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        caption: caption.trim(),
        chapterId,
        visibility,
        photoUri,
        takenAt,
        location: current,
        song,
      });
      router.back();
    } catch {
      setSaving(false);
    }
  };
  return (
    <Screen title={editing ? "Edit fragmen" : "Abadikan"} back>
      <View className="flex-1">
        <KeyboardRevealContext.Provider value={reveal}>
          <ScrollView
            ref={scrollRef}
            {...scrollProps}
            contentContainerStyle={{ paddingBottom: Space.xl + bottomInset }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerClassName="gap-8 p-4"
          >
            <FormProgress steps={steps} />
            <PhotoSection
              hasPhoto={hasPhoto}
              photoUri={photoUri}
              photoRatio={photoRatio}
              editing={editing}
              onPick={pickPhoto}
              onRemove={removePhoto}
            />
            <CaptionSection caption={caption} onChange={setCaption} />
            <ChapterSection
              chapters={chapters}
              chapterId={chapterId}
              onChange={setChapterId}
              onCreate={onCreateChapter}
            />
            <VisibilitySection
              visibility={visibility}
              onChange={setVisibility}
            />
            <View className="gap-4">
              <TypographyMuted className="text-xs">
                Detail tambahan
              </TypographyMuted>
              <CollapsibleSection
                icon={Clock}
                title="Waktu diambil"
                summary={`${formatLongDate(takenAtIso)}, ${formatTime(takenAtIso)}`}
                hint="Diisi otomatis dari data foto jika ada."
                done
              >
                <TakenAtSection
                  takenAt={takenAt}
                  calendarOpen={calendarOpen}
                  onToggle={() => setCalendarOpen((open) => !open)}
                  onSelect={pickDay}
                  onTimeChange={pickTime}
                />
              </CollapsibleSection>
              <CollapsibleSection
                icon={Music}
                title="Lagu"
                summary={
                  song ? `${song.title} · ${song.artist}` : "Belum dipilih"
                }
                hint="Mengalun di latar saat fragmen ini dibuka."
                done={song !== null}
              >
                <SongSection
                  song={song}
                  onClear={() => setSong(null)}
                  onPick={() => setSongPickerOpen(true)}
                />
              </CollapsibleSection>
              <CollapsibleSection
                icon={MapPin}
                title="Lokasi"
                summary={locationSummary}
                done={location !== null}
              >
                <LocationSection
                  location={location}
                  placeName={placeName}
                  photoHasNoGps={photoHasNoGps}
                  savedPlaces={savedPlaces}
                  onPlaceNameChange={setPlaceName}
                  onPickSaved={applyPlace}
                  onPick={() => setPickerOpen(true)}
                  onClear={clearLocation}
                />
              </CollapsibleSection>
            </View>
          </ScrollView>
        </KeyboardRevealContext.Provider>
        <FormFooter
          canSave={canSave}
          saving={saving}
          onCancel={cancel}
          onSave={save}
        />
      </View>
      <LocationPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onConfirm={(point) =>
          setLocationDraft({
            latitude: point.latitude,
            longitude: point.longitude,
          })
        }
      />
      <SongPicker
        open={songPickerOpen}
        onClose={() => setSongPickerOpen(false)}
        onConfirm={setSong}
      />
      <ConfirmDialog
        open={confirmDiscard}
        onOpenChange={setConfirmDiscard}
        title={editing ? "Buang perubahan?" : "Buang fragmen ini?"}
        description={
          editing
            ? "Perubahan yang sudah kamu buat belum tersimpan dan akan hilang."
            : "Foto dan cerita yang sudah kamu isi belum tersimpan dan akan hilang."
        }
        cancelLabel="Lanjut mengisi"
        confirmLabel="Buang"
        destructive
        onConfirm={() => router.back()}
      />
    </Screen>
  );
}

export { FragmentFormScreen };
export type { FragmentFormValues };
