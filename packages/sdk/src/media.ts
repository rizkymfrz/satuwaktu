import type { AxiosInstance } from "axios";
import { UPLOAD_FIELD, type UploadedPhoto } from "@repo/dto";
import { useMutation } from "@tanstack/react-query";
import { useApiClient } from "./provider.js";

export type PhotoFile = Blob | { uri: string; name: string; type: string };

const UPLOAD_TIMEOUT_MS = 120_000;

export async function uploadPhoto(http: AxiosInstance, file: PhotoFile) {
  const form = new FormData();
  form.append(UPLOAD_FIELD, file as Blob);
  const { data } = await http.post<UploadedPhoto>("uploads/photos", form, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: UPLOAD_TIMEOUT_MS,
  });
  return data;
}

export function useUploadPhoto() {
  const { http } = useApiClient();
  return useMutation({
    mutationFn: (file: PhotoFile) => uploadPhoto(http, file),
  });
}
