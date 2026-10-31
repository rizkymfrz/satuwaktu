import { ChevronRight, MapPin, Trash2 } from "lucide-react-native";
import { View } from "react-native";
import { MAX_PLACE_NAME_LENGTH } from "@repo/dto";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Text } from "@/components/ui/text";
import { TypographyMuted } from "@/components/ui/typography";
import type { Location } from "@/features/archive/types";
import type { PickedLocation } from "@/features/fragments/types";

function LocationSection({
  location,
  placeName,
  photoHasNoGps,
  savedPlaces,
  onPlaceNameChange,
  onPickSaved,
  onPick,
  onClear,
}: {
  location: PickedLocation | null;
  placeName: string;
  photoHasNoGps: boolean;
  savedPlaces: Location[];
  onPlaceNameChange: (value: string) => void;
  onPickSaved: (place: Location) => void;
  onPick: () => void;
  onClear: () => void;
}) {
  return (
    <View className="gap-4">
      {location ? (
        <View className="gap-4">
          <TypographyMuted>
            {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
            {location.source === "exif"
              ? " · dari data foto"
              : location.source === "saved"
                ? " · lokasi tersimpan"
                : " · dipilih di peta"}
          </TypographyMuted>
          <Input
            value={placeName}
            onChangeText={onPlaceNameChange}
            placeholder="Nama tempat (opsional)"
            accessibilityLabel="Nama tempat"
            maxLength={MAX_PLACE_NAME_LENGTH}
          />
        </View>
      ) : (
        <TypographyMuted>
          {photoHasNoGps
            ? "Foto ini tidak punya data lokasi. Pilih lokasinya di peta."
            : "Belum ada lokasi. Pilih sendiri di peta jika mau."}
        </TypographyMuted>
      )}
      {savedPlaces.length > 0 ? (
        <View className="gap-2">
          <TypographyMuted>
            {location
              ? "Atau pakai lokasi lain"
              : "Pakai lokasi yang pernah dipakai"}
          </TypographyMuted>
          <ItemGroup>
            {savedPlaces.map((place) => (
              <Item
                key={`${place.latitude},${place.longitude},${place.name}`}
                variant="outline"
                size="sm"
                onPress={() => onPickSaved(place)}
                accessibilityLabel={`Pakai lokasi ${place.name || "tanpa nama"}`}
              >
                <ItemMedia variant="icon">
                  <Icon as={MapPin} size={18} />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{place.name || "Tanpa nama"}</ItemTitle>
                  <ItemDescription numberOfLines={1}>
                    {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Icon as={ChevronRight} size={18} />
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        </View>
      ) : null}
      <View className="flex-row gap-4">
        <View className="flex-1">
          <Button shadowSize="md" variant="secondary" onPress={onPick}>
            <Icon as={MapPin} size={16} />
            <Text>{location ? "Ubah di peta" : "Pilih di peta"}</Text>
          </Button>
        </View>
        {location ? (
          <Button
            shadowSize="md"
            variant="destructive"
            size="icon"
            accessibilityLabel="Hapus lokasi"
            onPress={onClear}
          >
            <Icon as={Trash2} size={20} />
          </Button>
        ) : null}
      </View>
    </View>
  );
}

export { LocationSection };
