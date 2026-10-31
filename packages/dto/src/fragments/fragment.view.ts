export const VISIBILITIES = ["PUBLIC", "PRIVATE"] as const;

export type FragmentVisibility = (typeof VISIBILITIES)[number];

export interface FragmentLocationView {
  latitude: number;
  longitude: number;
  name: string;
}

export interface FragmentSongView {
  title: string;
  artist: string;
  uri: string;
  artworkUrl: string | null;
  startSec: number | null;
  endSec: number | null;
}

export interface ChapterRefView {
  id: string;
  name: string;
}

export interface UploaderView {
  id: string;
  name: string;
}

export interface FragmentView {
  id: string;
  caption: string;
  takenAt: string;
  visibility: FragmentVisibility;
  pinned: boolean;
  photoUrl: string | null;
  aspect: number;
  location: FragmentLocationView | null;
  song: FragmentSongView | null;
  chapter: ChapterRefView | null;
  uploader: UploaderView;
  likes: number;
  likedByMe: boolean;
  comments: number;
  createdAt: string;
}

export interface FragmentPage {
  items: FragmentView[];
  nextCursor: string | null;
}

export interface OnThisDayView {
  memory: FragmentView | null;
}

export interface FragmentNeighborsView {
  older: FragmentView | null;
  newer: FragmentView | null;
}
