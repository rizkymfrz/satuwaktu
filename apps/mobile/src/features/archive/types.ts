type Visibility = "PUBLIC" | "PRIVATE";

type ChapterRef = {
  id: string;
  name: string;
};

type Uploader = {
  id: string;
  name: string;
};

type Location = {
  latitude: number;
  longitude: number;
  name: string;
};

type Song = {
  title: string;
  artist: string;
  uri: string;
  artworkUrl?: string;
  startSec?: number;
  endSec?: number;
};

type Fragment = {
  id: string;
  caption: string;
  chapter: ChapterRef | null;
  uploader: Uploader;
  takenAt: string;
  pinned: boolean;
  visibility: Visibility;
  likes: number;
  photoUrl: string | null;
  location: Location | null;
  song: Song | null;
  aspect: number;
};

export type { ChapterRef, Fragment, Location, Song, Uploader, Visibility };
