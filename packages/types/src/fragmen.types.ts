import type { Chapter } from "./chapter.types";
import type { User } from "./user.types";

export type FragmenType = "PHOTO" | "VIDEO" | "TEXT";
export type Mood = "HANGAT" | "SUNYI" | "RIUH" | "SENDU" | "TERANG";

export interface Media {
  id: string;
  url: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  order: number;
}

export interface Fragmen {
  id: string;
  title: string | null;
  caption: string | null;
  type: FragmenType;
  mood: Mood | null;
  takenAt: Date;
  isPrivate: boolean;
  isPinned: boolean;
  isDraft: boolean;
  authorId: string;
  chapterId: string | null;
  media: Media[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FragmenWithRelations extends Fragmen {
  author: User;
  chapter: Chapter | null;
  _count?: {
    resonansis: number;
    titipanKata: number;
  };
}

export interface TitipanKata {
  id: string;
  content: string;
  fragmenId: string;
  visitorToken: string;
  createdAt: Date;
}
