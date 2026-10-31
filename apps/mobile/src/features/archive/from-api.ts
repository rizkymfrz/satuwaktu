import type { FragmentView } from "@repo/dto";
import type { Fragment } from "@/features/archive/types";
import { apiClient } from "@/lib/api";

function toFragment(view: FragmentView): Fragment {
  const { song } = view;
  return {
    id: view.id,
    caption: view.caption,
    chapter: view.chapter,
    uploader: view.uploader,
    takenAt: view.takenAt,
    pinned: view.pinned,
    visibility: view.visibility,
    likes: view.likes,
    photoUrl: view.photoUrl ? apiClient.mediaUrl(view.photoUrl) : null,
    location: view.location,
    song: song && {
      title: song.title,
      artist: song.artist,
      uri: song.uri,
      artworkUrl: song.artworkUrl ?? undefined,
      startSec: song.startSec ?? undefined,
      endSec: song.endSec ?? undefined,
    },
    aspect: view.aspect,
  };
}

export { toFragment };
