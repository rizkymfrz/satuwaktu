import type { TitipanKata } from "@satuwaktu/types";
import type { SatuwaktuClient } from "./client";

export const createTitipanKataApi = (client: SatuwaktuClient) => {
  return {
    list: (fragmenId: string, init?: RequestInit) =>
      client.get<TitipanKata[]>(`/v1/fragmen/${fragmenId}/titipan-kata`, init),
    create: (
      fragmenId: string,
      data: { content: string; visitorToken: string },
    ) =>
      client.post<TitipanKata>(`/v1/fragmen/${fragmenId}/titipan-kata`, data),
  };
};
