import type { Chapter } from "@satuwaktu/types";
import type { SatuwaktuClient } from "./client";

export interface CreateChapterInput {
  title: string;
  slug: string;
  description?: string;
  coverUrl?: string;
  order: number;
}

export type UpdateChapterInput = Partial<CreateChapterInput>;

export const createChapterApi = (client: SatuwaktuClient) => {
  return {
    list: (init?: RequestInit) => client.get<Chapter[]>("/v1/chapters", init),
    get: (id: string, init?: RequestInit) =>
      client.get<Chapter>(`/v1/chapters/${id}`, init),
    findBySlug: (slug: string, init?: RequestInit) =>
      client.get<Chapter>(`/v1/chapters/slug/${slug}`, init),
    create: (data: CreateChapterInput) =>
      client.post<Chapter>("/v1/chapters", data),
    update: (id: string, data: UpdateChapterInput) =>
      client.patch<Chapter>(`/v1/chapters/${id}`, data),
    delete: (id: string) => client.delete<void>(`/v1/chapters/${id}`),
  };
};
