type PickedLocation = {
  latitude: number;
  longitude: number;
  source: "exif" | "manual" | "saved";
};

export type { PickedLocation };
