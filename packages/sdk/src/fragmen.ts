import type {
  Fragmen,
  FragmenType,
  FragmenWithRelations,
  Media,
  Mood,
} from "@satuwaktu/types";
import type { SatuwaktuClient } from "./client";

export interface CreateFragmenInput {
  title?: string;
  caption?: string;
  type: FragmenType;
  mood?: Mood;
  takenAt: string;
  isPrivate?: boolean;
  isDraft?: boolean;
  chapterId?: string;
}

export interface UpdateFragmenInput {
  title?: string;
  caption?: string;
  type?: FragmenType;
  mood?: Mood;
  takenAt?: string;
  isPrivate?: boolean;
  isDraft?: boolean;
  isPinned?: boolean;
  chapterId?: string;
}

export interface QueryFragmenInput {
  page?: number;
  limit?: number;
  chapterId?: string;
  type?: FragmenType;
  mood?: Mood;
  isDraft?: boolean;
  isPrivate?: boolean;
}

export const createFragmenApi = (client: SatuwaktuClient) => {
  return {
    list: (params?: QueryFragmenInput, init?: RequestInit) => {
      const qs = params
        ? "?" +
          new URLSearchParams(
            Object.fromEntries(
              Object.entries(params)
                .filter(([, v]) => v !== undefined)
                .map(([k, v]) => [k, String(v)]),
            ),
          ).toString()
        : "";
      return client.get<FragmenWithRelations[]>(`/v1/fragmen${qs}`, init);
    },
    get: (id: string, init?: RequestInit) =>
      client.get<FragmenWithRelations>(`/v1/fragmen/${id}`, init),
    create: (data: CreateFragmenInput) =>
      client.post<Fragmen>("/v1/fragmen", data),
    update: (id: string, data: UpdateFragmenInput) =>
      client.patch<Fragmen>(`/v1/fragmen/${id}`, data),
    delete: (id: string) => client.delete<void>(`/v1/fragmen/${id}`),
    uploadMedia: (fragmenId: string, file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return client.formPost<Media>(`/v1/fragmen/${fragmenId}/media`, formData);
    },
    deleteMedia: (mediaId: string) =>
      client.delete<void>(`/v1/media/${mediaId}`),
  };
};
