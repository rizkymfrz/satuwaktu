import { useRef } from "react";
import { useUploadPhoto } from "@repo/sdk";
import { toPhotoFile } from "@/features/fragments/photo-file";

function usePhotoUpload() {
  const { mutateAsync } = useUploadPhoto();
  const uploaded = useRef<{ uri: string; url: string } | null>(null);
  return async (uri: string) => {
    if (uploaded.current?.uri !== uri) {
      const photo = await mutateAsync(await toPhotoFile(uri));
      uploaded.current = { uri, url: photo.url };
    }
    return uploaded.current.url;
  };
}

export { usePhotoUpload };
