import type { Song } from "@/features/archive/types";

type ItunesTrack = {
  trackName?: string;
  artistName?: string;
  previewUrl?: string;
  artworkUrl100?: string;
};

const PREVIEW_SECONDS = 30;

async function searchSongs(term: string, signal?: AbortSignal) {
  const query = new URLSearchParams({
    term,
    entity: "song",
    limit: "15",
    country: "id",
  });
  const response = await fetch(
    `https://itunes.apple.com/search?${query.toString()}`,
    { signal },
  );
  if (!response.ok) {
    throw new Error("itunes-search-failed");
  }
  const data: { results?: ItunesTrack[] } = await response.json();
  const songs: Song[] = [];
  for (const track of data.results ?? []) {
    if (!track.previewUrl || !track.trackName) {
      continue;
    }
    songs.push({
      title: track.trackName,
      artist: track.artistName ?? "",
      uri: track.previewUrl,
      artworkUrl: track.artworkUrl100,
      startSec: 0,
      endSec: PREVIEW_SECONDS,
    });
  }
  return songs;
}

export { PREVIEW_SECONDS, searchSongs };
