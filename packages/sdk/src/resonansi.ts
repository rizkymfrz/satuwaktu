import type { ResonansiCount, ResonansiType } from "@satuwaktu/types";
import type { SatuwaktuClient } from "./client";

export const createResonansiApi = (client: SatuwaktuClient) => {
  return {
    getCounts: (fragmenId: string, init?: RequestInit) =>
      client.get<ResonansiCount>(`/v1/fragmen/${fragmenId}/resonansi`, init),
    toggle: (
      fragmenId: string,
      data: { type: ResonansiType; visitorToken: string },
    ) =>
      client.post<{ toggled: boolean }>(
        `/v1/fragmen/${fragmenId}/resonansi`,
        data,
      ),
  };
};
