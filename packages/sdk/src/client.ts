import axios, { isAxiosError, isCancel, type AxiosInstance } from "axios";
import { DEVICE_ID_HEADER, type ErrorResponse } from "@repo/dto";

type Lazy<T> = () => T | Promise<T>;

const ORIGIN_PATTERN = /^[a-z][a-z\d+.-]*:\/\/[^/]+/i;
const ABSOLUTE_URL_PATTERN = /^[a-z][a-z\d+.-]*:\/\//i;

export interface ApiClientOptions {
  baseUrl: string;
  getToken?: Lazy<string | null>;
  getDeviceId?: Lazy<string | null>;
  timeoutMs?: number;
}

export interface ApiClient {
  http: AxiosInstance;
  mediaUrl: (path: string) => string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly details: string[];

  constructor(status: number, message: string, details: string[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

function toApiError(error: unknown) {
  if (isCancel(error) || !isAxiosError<Partial<ErrorResponse>>(error)) {
    return error;
  }
  const body = error.response?.data;
  return new ApiError(
    error.response?.status ?? 0,
    body?.message ?? error.message,
    body?.details,
  );
}

export function createApiClient(options: ApiClientOptions): ApiClient {
  const baseUrl = options.baseUrl.replace(/\/+$/, "");
  const origin = ORIGIN_PATTERN.exec(baseUrl)?.[0];
  if (!origin) {
    throw new Error("baseUrl must be an absolute URL");
  }
  const http = axios.create({ baseURL: baseUrl, timeout: options.timeoutMs });
  http.interceptors.request.use(async (config) => {
    const [token, deviceId] = await Promise.all([
      options.getToken?.(),
      options.getDeviceId?.(),
    ]);
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    if (deviceId) {
      config.headers.set(DEVICE_ID_HEADER, deviceId);
    }
    return config;
  });
  http.interceptors.response.use(undefined, (error: unknown) =>
    Promise.reject(toApiError(error)),
  );
  return {
    http,
    mediaUrl: (path) =>
      ABSOLUTE_URL_PATTERN.test(path) ? path : `${origin}${path}`,
  };
}
