export type ResonansiType = "BEEN_HERE" | "BEING_HERE" | "MISS_THIS";

export interface Resonansi {
  id: string;
  type: ResonansiType;
  fragmenId: string;
  visitorToken: string;
  createdAt: Date;
}

export interface ResonansiCount {
  BEEN_HERE: number;
  BEING_HERE: number;
  MISS_THIS: number;
  total: number;
}
