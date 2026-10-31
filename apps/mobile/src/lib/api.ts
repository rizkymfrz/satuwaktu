import { randomUUID } from "expo-crypto";
import { QueryClient } from "@tanstack/react-query";
import { createApiClient, isApiError } from "@repo/sdk";
import {
  deleteSecureItem,
  getSecureItem,
  setSecureItem,
} from "@/lib/secure-storage";

const MAX_RETRIES = 2;
const REQUEST_TIMEOUT_MS = 10_000;
const ACCESS_TOKEN_KEY = "access-token";
const DEVICE_ID_KEY = "device-id";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("EXPO_PUBLIC_API_URL is not set");
}

const tokenStorage = {
  get: () => getSecureItem(ACCESS_TOKEN_KEY),
  set: (token: string) => setSecureItem(ACCESS_TOKEN_KEY, token),
  clear: () => deleteSecureItem(ACCESS_TOKEN_KEY),
};

async function loadDeviceId() {
  const stored = await getSecureItem(DEVICE_ID_KEY);
  if (stored) {
    return stored;
  }
  const created = randomUUID();
  await setSecureItem(DEVICE_ID_KEY, created);
  return created;
}

let deviceId: Promise<string> | null = null;

function getDeviceId() {
  deviceId ??= loadDeviceId().catch((error: unknown) => {
    deviceId = null;
    throw error;
  });
  return deviceId;
}

const apiClient = createApiClient({
  baseUrl: API_URL,
  timeoutMs: REQUEST_TIMEOUT_MS,
  getToken: tokenStorage.get,
  getDeviceId,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) =>
        failureCount < MAX_RETRIES &&
        !(isApiError(error) && error.status >= 400 && error.status < 500),
    },
  },
});

export { apiClient, queryClient, tokenStorage };
