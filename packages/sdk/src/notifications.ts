import type { AxiosInstance } from "axios";
import type { PushTokenParams } from "@repo/dto";
import { useMutation } from "@tanstack/react-query";
import { useApiClient } from "./provider.js";

export async function registerPushToken(
  http: AxiosInstance,
  body: PushTokenParams,
) {
  await http.put("push-tokens", body);
}

export async function unregisterPushToken(
  http: AxiosInstance,
  body: PushTokenParams,
) {
  await http.delete("push-tokens", { data: body });
}

export function useRegisterPushToken() {
  const { http } = useApiClient();
  return useMutation({
    mutationFn: (body: PushTokenParams) => registerPushToken(http, body),
  });
}

export function useUnregisterPushToken() {
  const { http } = useApiClient();
  return useMutation({
    mutationFn: (body: PushTokenParams) => unregisterPushToken(http, body),
  });
}
