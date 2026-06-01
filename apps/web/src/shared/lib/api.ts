import { createApi } from "@satuwaktu/sdk";

const baseUrl =
  typeof window === "undefined"
    ? (process.env.INTERNAL_API_URL ?? "http://localhost:4000")
    : "";

export const api = createApi({ baseUrl });
