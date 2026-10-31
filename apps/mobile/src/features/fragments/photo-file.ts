import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { Platform } from "react-native";
import type { PhotoFile } from "@repo/sdk";
import { isHeifAsset } from "@/features/fragments/photo-format";

const PHOTO_QUALITY = 0.8;
const DEFAULT_PHOTO_NAME = "photo.jpg";
const DEFAULT_PHOTO_TYPE = "image/jpeg";

const PHOTO_TYPE_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
  heif: "image/heic",
};

async function toUploadableUri(asset: {
  uri: string;
  mimeType?: string | null;
  fileName?: string | null;
}) {
  if (!isHeifAsset(asset)) {
    return asset.uri;
  }
  const image = await ImageManipulator.manipulate(asset.uri).renderAsync();
  const converted = await image.saveAsync({
    format: SaveFormat.JPEG,
    compress: PHOTO_QUALITY,
  });
  return converted.uri;
}

async function toPhotoFile(uri: string): Promise<PhotoFile> {
  if (Platform.OS === "web") {
    return (await fetch(uri)).blob();
  }
  const name = uri.split("?")[0]?.split("/").pop() || DEFAULT_PHOTO_NAME;
  const extension = name.split(".").pop()?.toLowerCase() ?? "";
  return {
    uri,
    name,
    type: PHOTO_TYPE_BY_EXTENSION[extension] ?? DEFAULT_PHOTO_TYPE,
  };
}

export { PHOTO_QUALITY, toPhotoFile, toUploadableUri };
