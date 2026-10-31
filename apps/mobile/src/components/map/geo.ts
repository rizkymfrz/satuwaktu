import type { InitialViewState } from "@maplibre/maplibre-react-native";
import type { Fragment } from "@/features/archive/types";

type LatLng = { latitude: number; longitude: number };

type Pin = {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  fragments: Fragment[];
};

const PIN_RADIUS = 0.004;
const FOCUS_ZOOM = 14;
const MIN_SPAN_DEGREES = 0.02;
const FIT_MARGIN = 1.5;
const INDONESIA_VIEW: InitialViewState = { bounds: [95, -11, 141, 6] };

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

function fitView(points: LatLng[]): InitialViewState {
  if (points.length === 0) {
    return INDONESIA_VIEW;
  }
  const latitudes = points.map((point) => point.latitude);
  const longitudes = points.map((point) => point.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);
  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;
  const halfLat =
    Math.max((maxLat - minLat) * FIT_MARGIN, MIN_SPAN_DEGREES) / 2;
  const halfLng =
    Math.max((maxLng - minLng) * FIT_MARGIN, MIN_SPAN_DEGREES) / 2;
  return {
    bounds: [
      centerLng - halfLng,
      centerLat - halfLat,
      centerLng + halfLng,
      centerLat + halfLat,
    ],
  };
}

function focusView(latitude: number, longitude: number): InitialViewState {
  return { center: [longitude, latitude], zoom: FOCUS_ZOOM };
}

export { fitView, FOCUS_ZOOM, focusView, groupPins, INDONESIA_VIEW };
export type { LatLng, Pin };
