import { ImagePlus, RefreshCw, X } from "lucide-react-native";
import { Image, Pressable, View } from "react-native";
import { Frame } from "@/components/scrapbook/frame";
import { Tape } from "@/components/scrapbook/tape";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { TypographyMuted, TypographySmall } from "@/components/ui/typography";
import type { Fragment } from "@/features/archive/types";
import { FormSection } from "@/features/fragments/components/form/form-section";

function PhotoSection({
  hasPhoto,
  photoUri,
  photoRatio,
  editing,
  onPick,
  onRemove,
}: {
  hasPhoto: boolean;
  photoUri: string | null;
  photoRatio: number;
  editing: Fragment | undefined;
  onPick: () => void;
  onRemove: () => void;
}) {
  return (
    <FormSection
      title="Foto"
      hint="Lokasi dibaca otomatis dari data foto jika ada."
    >
      {hasPhoto ? (
        <View className="pr-1">
          <Frame contentClassName="p-2 pb-8">
            <View
              className="overflow-hidden border-2 border-border"
              style={{ aspectRatio: photoRatio }}
            >
              {photoUri ? (
                <Image
                  source={{ uri: photoUri }}
                  accessibilityLabel="Foto yang dipilih"
                  className="absolute inset-0 size-full"
                  resizeMode="cover"
                />
              ) : null}
              <View className="absolute right-4 top-4 flex-row gap-2">
                <Button
                  shadowSize="md"
                  size="sm"
                  variant="secondary"
                  accessibilityLabel="Ganti foto"
                  onPress={onPick}
                >
                  <Icon as={RefreshCw} size={14} />
                  <Text>Ganti</Text>
                </Button>
                {editing ? null : (
                  <Button
                    shadowSize="md"
                    size="icon-sm"
                    variant="destructive"
                    accessibilityLabel="Hapus foto"
                    onPress={onRemove}
                  >
                    <Icon as={X} size={16} />
                  </Button>
                )}
              </View>
            </View>
          </Frame>
          <Tape
            seed="foto-form"
            width={64}
            height={20}
            className="absolute -top-2 self-center"
          />
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Pilih foto dari galeri"
          onPress={onPick}
        >
          {({ pressed }) => (
            <Frame
              pressed={pressed}
              style={{ aspectRatio: 4 / 3 }}
              contentClassName="items-center justify-center gap-2 border-dashed px-4"
            >
              <View className="size-14 items-center justify-center rounded-full border-2 border-border bg-primary">
                <Icon as={ImagePlus} size={24} />
              </View>
              <TypographySmall className="text-base">
                Pilih foto dari galeri
              </TypographySmall>
              <TypographyMuted className="text-center text-xs">
                Ketuk untuk memilih momen yang ingin diabadikan
              </TypographyMuted>
            </Frame>
          )}
        </Pressable>
      )}
    </FormSection>
  );
}

export { PhotoSection };
