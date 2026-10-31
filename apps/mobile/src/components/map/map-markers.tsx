import { MapPin, Star } from "lucide-react-native";
import { View } from "react-native";
import type { LatLng } from "@/components/map/geo";
import { Icon } from "@/components/ui/icon";
import type { Fragment } from "@/features/archive/types";
import { Marker } from "@/lib/maplibre";
import { PALETTE } from "@/theme/palette";
import { Space } from "@/theme/space";

const SHADOW = Space.sm;
const PIN_SIZE = 44;
const SELECTED_PIN_SIZE = 56;
const GLYPH_RATIO = 0.32;
const HEAD_CENTER_RATIO = 10 / 24;
const SELECTED_Z_INDEX = 1;

function PinShape({
  size,
  fill,
  starred = false,
}: {
  size: number;
  fill: string;
  starred?: boolean;
}) {
  const box = size + SHADOW;
  const glyph = size * GLYPH_RATIO;
  const glyphColor =
    fill === PALETTE.light.secondary
      ? PALETTE.light.secondaryForeground
      : PALETTE.light.border;
  return (
    <View style={{ width: box, height: box }}>
      <View style={{ position: "absolute", left: SHADOW, top: SHADOW }}>
        <Icon
          as={MapPin}
          size={size}
          strokeWidth={2}
          color={PALETTE.light.border}
          fill={PALETTE.light.border}
        />
      </View>
      <View style={{ position: "absolute", left: 0, top: 0 }}>
        <Icon
          as={MapPin}
          size={size}
          strokeWidth={2}
          color={PALETTE.light.border}
          fill={fill}
        />
      </View>
      {starred ? (
        <View
          style={{
            position: "absolute",
            left: (size - glyph) / 2,
            top: size * HEAD_CENTER_RATIO - glyph / 2,
          }}
        >
          <Icon
            as={Star}
            size={glyph}
            strokeWidth={2}
            color={glyphColor}
            fill={glyphColor}
          />
        </View>
      ) : null}
    </View>
  );
}

function PinMarker({
  fragment,
  selected,
  onPress,
}: {
  fragment: Fragment;
  selected: boolean;
  onPress: () => void;
}) {
  const location = fragment.location;
  if (!location) {
    return null;
  }
  return (
    <Marker
      lngLat={[location.longitude, location.latitude]}
      onPress={onPress}
      anchor="bottom"
      style={{ zIndex: selected ? SELECTED_Z_INDEX : 0 }}
      accessibilityLabel={fragment.caption || location.name || "Fragmen"}
    >
      <PinShape
        size={selected ? SELECTED_PIN_SIZE : PIN_SIZE}
        fill={selected ? PALETTE.light.secondary : PALETTE.light.primary}
        starred={fragment.pinned}
      />
    </Marker>
  );
}

function DraftMarker({ coordinate }: { coordinate: LatLng }) {
  return (
    <Marker
      lngLat={[coordinate.longitude, coordinate.latitude]}
      anchor="bottom"
      accessibilityLabel="Lokasi dipilih"
    >
      <PinShape size={PIN_SIZE} fill={PALETTE.light.primary} />
    </Marker>
  );
}

export { DraftMarker, PinMarker };
