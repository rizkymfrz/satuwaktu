import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Image } from "react-native";
import { toast } from "@/components/ui/sonner";
import type {
  Fragment,
  Location,
  Song,
  Visibility,
} from "@/features/archive/types";
import { extractGps, extractTakenAt } from "@/features/fragments/exif-location";
import {
  setLocationDraft,
  useLocationDraft,
} from "@/features/fragments/location-draft";
import {
  PHOTO_QUALITY,
  toUploadableUri,
} from "@/features/fragments/photo-file";
import {
  clampRatio,
  initialPhotoRatio,
} from "@/features/fragments/photo-ratio";
import type { PickedLocation } from "@/features/fragments/types";
import { useSettings } from "@/features/settings/store";

function useFragmentForm(editing: Fragment | undefined) {
  const { settings } = useSettings();
  const [caption, setCaption] = useState(editing?.caption ?? "");
  const [chapterId, setChapterId] = useState<string | null>(
    editing?.chapter?.id ?? null,
  );
  const [visibility, setVisibility] = useState<Visibility>(
    editing?.visibility ?? settings.defaultVisibility,
  );
  const [photoUri, setPhotoUri] = useState<string | null>(
    editing?.photoUrl ?? null,
  );
  const [takenAt, setTakenAt] = useState(() =>
    editing ? new Date(editing.takenAt) : new Date(),
  );
  const [photoRatio, setPhotoRatio] = useState(() =>
    initialPhotoRatio(editing),
  );
  const [photoHasNoGps, setPhotoHasNoGps] = useState(false);
  const [exifLocation, setExifLocation] = useState<PickedLocation | null>(
    editing?.location
      ? {
          latitude: editing.location.latitude,
          longitude: editing.location.longitude,
          source: "saved",
        }
      : null,
  );
  const [placeName, setPlaceName] = useState(editing?.location?.name ?? "");
  const [saving, setSaving] = useState(false);
  const picked = useLocationDraft();
  const [song, setSong] = useState<Song | null>(editing?.song ?? null);
  const location: PickedLocation | null = picked
    ? { ...picked, source: "manual" }
    : exifLocation;
  const hasPhoto = photoUri !== null;
  const canSave = !saving && (hasPhoto || caption.trim().length > 0);
  const current = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        name: placeName.trim(),
      }
    : null;
  const original = editing?.location ?? null;
  const locationChanged =
    !!current !== !!original ||
    (!!current &&
      !!original &&
      (current.latitude !== original.latitude ||
        current.longitude !== original.longitude ||
        current.name !== original.name));
  const dirty = editing
    ? caption.trim() !== editing.caption ||
      chapterId !== (editing.chapter?.id ?? null) ||
      visibility !== editing.visibility ||
      takenAt.toISOString() !== editing.takenAt ||
      photoUri !== editing.photoUrl ||
      song?.uri !== editing.song?.uri ||
      song?.startSec !== editing.song?.startSec ||
      song?.endSec !== editing.song?.endSec ||
      locationChanged
    : photoUri !== null || caption.trim().length > 0 || !!location || !!song;
  useEffect(() => () => setLocationDraft(null), []);
  useEffect(() => {
    if (!editing?.photoUrl || photoUri !== editing.photoUrl) {
      return;
    }
    Image.getSize(
      editing.photoUrl,
      (width, height) => setPhotoRatio(clampRatio(width, height)),
      () => {},
    );
  }, [editing, photoUri]);
  const pickPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        exif: true,
        quality: PHOTO_QUALITY,
      });
      if (result.canceled || result.assets.length === 0) {
        return;
      }
      const asset = result.assets[0];
      setPhotoUri(await toUploadableUri(asset));
      setPhotoRatio(clampRatio(asset.width, asset.height));
      const gps = extractGps(asset.exif);
      setPhotoHasNoGps(!gps);
      const exifTakenAt = extractTakenAt(asset.exif);
      if (exifTakenAt && exifTakenAt <= new Date()) {
        setTakenAt(exifTakenAt);
      }
      if (gps) {
        setExifLocation({ ...gps, source: "exif" });
        toast.success("Lokasi diambil dari data foto.");
      }
    } catch {
      toast.error("Foto tidak bisa dibuka. Coba pilih foto lain.");
    }
  };
  const removePhoto = () => {
    setPhotoUri(null);
    setPhotoHasNoGps(false);
    if (exifLocation) {
      setExifLocation(null);
      setPlaceName("");
    }
  };
  const clearLocation = () => {
    setLocationDraft(null);
    setExifLocation(null);
    setPlaceName("");
  };
  const applyPlace = (place: Location) => {
    setLocationDraft(null);
    setExifLocation({
      latitude: place.latitude,
      longitude: place.longitude,
      source: "saved",
    });
    setPlaceName(place.name);
  };
  return {
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
  };
}

export { useFragmentForm };
