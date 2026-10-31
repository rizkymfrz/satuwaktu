import type { Region } from "react-native-maps";
import type { Fragment } from "@/features/archive/types";

type Pin = {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  fragments: Fragment[];
};

const PIN_RADIUS = 0.004;

const INDONESIA_REGION: Region = {
  latitude: -2.5,
  longitude: 118,
  latitudeDelta: 30,
  longitudeDelta: 40,
};

function groupPins(fragments: Fragment[]): Pin[] {
  const pins: Pin[] = [];
  const sorted = [...fragments].sort((a, b) =>
    b.takenAt.localeCompare(a.takenAt),
  );
  sorted.forEach((fragment) => {
    const location = fragment.location;
    if (!location) {
      return;
    }
    const existing = pins.find(
      (pin) =>
        Math.abs(pin.latitude - location.latitude) <= PIN_RADIUS &&
        Math.abs(pin.longitude - location.longitude) <= PIN_RADIUS,
    );
    if (existing) {
      existing.fragments.push(fragment);
      if (!existing.name && location.name) {
        existing.name = location.name;
      }
      return;
    }
    pins.push({
      id: `pin-${pins.length}-${fragment.id}`,
      latitude: location.latitude,
      longitude: location.longitude,
      name: location.name,
      fragments: [fragment],
    });
  });
  return pins;
}

function fitRegion(points: { latitude: number; longitude: number }[]) {
  if (points.length === 0) {
    return INDONESIA_REGION;
  }
  const latitudes = points.map((point) => point.latitude);
  const longitudes = points.map((point) => point.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max((maxLat - minLat) * 1.5, 0.02),
    longitudeDelta: Math.max((maxLng - minLng) * 1.5, 0.02),
  } satisfies Region;
}

function zoomToRegion(
  latitude: number,
  longitude: number,
  zoom: number,
): Region {
  const delta = 360 / Math.pow(2, zoom);
  return {
    latitude,
    longitude,
    latitudeDelta: delta,
    longitudeDelta: delta,
  };
}

export { fitRegion, groupPins, INDONESIA_REGION, zoomToRegion };
export type { Pin };
