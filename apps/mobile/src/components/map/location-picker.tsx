import * as Location from "expo-location";
import { Check, LocateFixed } from "lucide-react-native";
import { useRef, useState } from "react";
import { View } from "react-native";
import MapView, { type LatLng } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SnapDrawer } from "@/components/layout/snap-drawer";
import { INDONESIA_REGION, zoomToRegion } from "@/components/map/geo";
import { DraftMarker } from "@/components/map/map-markers";
import { TapedPaper } from "@/components/scrapbook/taped-paper";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { toast } from "@/components/ui/sonner";
import { Text } from "@/components/ui/text";
import { TypographyH4, TypographyMuted } from "@/components/ui/typography";
import { Space } from "@/theme/space";

function LocationPicker({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (point: LatLng) => void;
}) {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const [point, setPoint] = useState<LatLng | null>(null);
  const [locating, setLocating] = useState(false);
  const close = () => {
    setPoint(null);
    onClose();
  };
  const centerOnMe = async () => {
    setLocating(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== "granted") {
        toast.info(
          "Izin lokasi ditolak. Kamu tetap bisa memilih titik di peta.",
        );
        return;
      }
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      mapRef.current?.animateToRegion(
        zoomToRegion(position.coords.latitude, position.coords.longitude, 14),
        400,
      );
    } catch {
      toast.error(
        "Lokasi perangkat tidak bisa dibaca. Pilih titik secara manual.",
      );
    } finally {
      setLocating(false);
    }
  };
  const confirm = () => {
    if (!point) {
      return;
    }
    onConfirm(point);
    close();
  };
  return (
    <SnapDrawer
      open={open}
      onClose={close}
      snapPoints={[1]}
      scroll={false}
      header={
        <View className="gap-1 p-4">
          <TypographyH4 className="font-head">Pilih lokasi</TypographyH4>
          <TypographyMuted className="text-xs">
            {point
              ? `${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}`
              : "Ketuk peta untuk menandai lokasi foto."}
          </TypographyMuted>
        </View>
      }
    >
      <View className="flex-1 border-t-2 border-border">
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={INDONESIA_REGION}
          onPress={(event) => setPoint(event.nativeEvent.coordinate)}
          toolbarEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
        >
          {point ? <DraftMarker coordinate={point} /> : null}
        </MapView>
        <View className="absolute right-4 top-4">
          <Button
            variant="outline"
            size="icon"
            disabled={locating}
            accessibilityLabel="Pusatkan ke lokasiku"
            onPress={centerOnMe}
          >
            <Icon as={LocateFixed} size={18} />
          </Button>
        </View>
        <View
          className="absolute inset-x-0 bottom-0 px-4"
          style={{ paddingBottom: insets.bottom + Space.lg }}
          pointerEvents="box-none"
        >
          <TapedPaper
            tape="center"
            seed="pilih-lokasi"
            contentClassName="gap-4 p-4"
          >
            <TypographyMuted>
              {point
                ? "Titik sudah ditandai. Ketuk lagi untuk memindahkan."
                : "Belum ada titik yang dipilih."}
            </TypographyMuted>
            <Button disabled={!point} onPress={confirm}>
              <Icon as={Check} size={16} />
              <Text>Pakai lokasi ini</Text>
            </Button>
          </TapedPaper>
        </View>
      </View>
    </SnapDrawer>
  );
}

export { LocationPicker };
