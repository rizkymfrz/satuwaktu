import type { FragmentVisibility } from "./fragment.view.js";

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 50;
export const NO_CHAPTER = "none";
export const MAX_CAPTION_LENGTH = 280;
export const MAX_SEARCH_LENGTH = 100;
export const MAX_PLACE_NAME_LENGTH = 120;
export const MAX_SONG_TEXT_LENGTH = 200;
export const MAX_SONG_URL_LENGTH = 500;

export interface ListFragmentsParams {
  cursor?: string;
  limit?: number;
  chapterId?: string;
  uploaderId?: string;
  q?: string;
  hasLocation?: boolean;
  pinned?: boolean;
}

export interface LocationInput {
  latitude: number;
  longitude: number;
  name?: string;
}

export interface SongInput {
  title: string;
  artist?: string;
  uri: string;
  artworkUrl?: string;
  startSec?: number;
  endSec?: number;
}

export interface CreateFragmentParams {
  caption?: string;
  takenAt?: string;
  visibility?: FragmentVisibility;
  chapterId?: string | null;
  photoUrl?: string;
  location?: LocationInput | null;
  song?: SongInput | null;
  pinned?: boolean;
}

export type UpdateFragmentParams = CreateFragmentParams;
