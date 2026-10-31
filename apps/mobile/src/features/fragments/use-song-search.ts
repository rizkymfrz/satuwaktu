import { useEffect, useState } from "react";
import type { Song } from "@/features/archive/types";
import { searchSongs } from "@/features/fragments/itunes";

const DEBOUNCE_MS = 400;

type SearchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error" }
  | { status: "done"; songs: Song[] };

type SearchResult = { query: string; songs: Song[] | null };

function useSongSearch(term: string): SearchState {
  const query = term.trim();
  const [result, setResult] = useState<SearchResult | null>(null);
  useEffect(() => {
    if (query.length < 2) {
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      searchSongs(query, controller.signal)
        .then((songs) => setResult({ query, songs }))
        .catch(() => {
          if (!controller.signal.aborted) {
            setResult({ query, songs: null });
          }
        });
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);
  if (query.length < 2) {
    return { status: "idle" };
  }
  if (result?.query !== query) {
    return { status: "loading" };
  }
  return result.songs
    ? { status: "done", songs: result.songs }
    : { status: "error" };
}

export { useSongSearch };
export type { SearchState };
