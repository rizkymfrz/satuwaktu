import { Check } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SnapDrawer } from "@/components/layout/snap-drawer";
import { TapedPaper } from "@/components/scrapbook/taped-paper";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { TypographyH4, TypographyMuted } from "@/components/ui/typography";
import type { Song } from "@/features/archive/types";
import { ClipEditor } from "@/features/fragments/components/song/clip-editor";
import { SongResults } from "@/features/fragments/components/song/song-results";
import { useSongSearch } from "@/features/fragments/use-song-search";
import { Space } from "@/theme/space";

function SongPicker({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (song: Song) => void;
}) {
  const insets = useSafeAreaInsets();
  const [term, setTerm] = useState("");
  const [selected, setSelected] = useState<Song | null>(null);
  const search = useSongSearch(term);
  const close = () => {
    setSelected(null);
    setTerm("");
    onClose();
  };
  const confirm = () => {
    if (!selected) {
      return;
    }
    onConfirm(selected);
    close();
  };
  return (
    <SnapDrawer
      open={open}
      onClose={close}
      snapPoints={[0.75, 1]}
      scroll={false}
      header={
        <View className="gap-4 p-4">
          <View className="gap-1">
            <TypographyH4 className="font-head">Pilih lagu</TypographyH4>
            <TypographyMuted className="text-xs">
              Pratinjau 30 detik dari iTunes. Atur bagian yang diputar.
            </TypographyMuted>
          </View>
          <Input
            value={term}
            onChangeText={setTerm}
            placeholder="Cari judul atau artis"
            accessibilityLabel="Cari lagu"
            autoCorrect={false}
            returnKeyType="search"
          />
        </View>
      }
    >
      <View className="flex-1 border-t-2 border-border">
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerClassName="gap-2 p-4"
        >
          <SongResults
            search={search}
            selected={selected}
            onSelect={setSelected}
          />
        </ScrollView>
        {selected ? (
          <View
            className="px-4"
            style={{ paddingBottom: insets.bottom + Space.lg }}
          >
            <TapedPaper
              tape="center"
              seed="pilih-lagu"
              contentClassName="gap-4 p-4"
            >
              <ClipEditor
                key={selected.uri}
                song={selected}
                onChange={setSelected}
              />
              <Button onPress={confirm}>
                <Icon as={Check} size={16} />
                <Text>Pakai lagu ini</Text>
              </Button>
            </TapedPaper>
          </View>
        ) : null}
      </View>
    </SnapDrawer>
  );
}

export { SongPicker };
