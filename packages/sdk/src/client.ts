import type { ApiResponse } from "@satuwaktu/types";

export interface SatuwaktuClientOptions {
  baseUrl: string;
  headers?: Record<string, string>;
}

export const createSatuwaktuClient = (options: SatuwaktuClientOptions) => {
  const { baseUrl, headers: defaultHeaders = {} } = options;

  const request = async <T>(
    method: string,
    path: string,
    body?: unknown,
    init?: RequestInit,
  ): Promise<T> => {
    const isFormData = body instanceof FormData;
    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      method,
      credentials: "include",
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...defaultHeaders,
        ...(init?.headers as Record<string, string> | undefined),
      },
      body:
        body !== undefined
          ? isFormData
            ? body
            : JSON.stringify(body)
          : undefined,
    });

    const json = (await res.json()) as ApiResponse<T>;
    if (!json.success) {
      throw new Error(json.message ?? "Request failed");
    }
    return json.data as T;
  };

  return {
    get: <T>(path: string, init?: RequestInit) =>
      request<T>("GET", path, undefined, init),
    post: <T>(path: string, body?: unknown, init?: RequestInit) =>
      request<T>("POST", path, body, init),
    patch: <T>(path: string, body?: unknown, init?: RequestInit) =>
      request<T>("PATCH", path, body, init),
    put: <T>(path: string, body?: unknown, init?: RequestInit) =>
      request<T>("PUT", path, body, init),
    delete: <T>(path: string, init?: RequestInit) =>
      request<T>("DELETE", path, undefined, init),
    formPost: <T>(path: string, formData: FormData, init?: RequestInit) =>
      request<T>("POST", path, formData, init),
  };
};

export type SatuwaktuClient = ReturnType<typeof createSatuwaktuClient>;
