import type { Prisma } from '@repo/db';
import type { FragmentView } from '@repo/dto';

export const DEFAULT_ASPECT = 1.3;
const NO_VOTER = '';

export function fragmentSelect(voterKey: string | null) {
  return {
    id: true,
    caption: true,
    takenAt: true,
    visibility: true,
    pinned: true,
    photoUrl: true,
    photoWidth: true,
    photoHeight: true,
    latitude: true,
    longitude: true,
    placeName: true,
    songTitle: true,
    songArtist: true,
    songUri: true,
    songArtworkUrl: true,
    songStartSec: true,
    songEndSec: true,
    createdAt: true,
    chapter: { select: { id: true, name: true } },
    uploader: { select: { id: true, name: true } },
    likes: {
      where: { voterKey: voterKey ?? NO_VOTER },
      select: { id: true },
      take: 1,
    },
    _count: { select: { likes: true, comments: true } },
  } satisfies Prisma.FragmentSelect;
}

export type FragmentRecord = Prisma.FragmentGetPayload<{
  select: ReturnType<typeof fragmentSelect>;
}>;

export function toFragmentView(record: FragmentRecord): FragmentView {
  const { photoWidth, photoHeight, latitude, longitude } = record;
  return {
    id: record.id,
    caption: record.caption,
    takenAt: record.takenAt.toISOString(),
    visibility: record.visibility,
    pinned: record.pinned,
    photoUrl: record.photoUrl,
    aspect:
      photoWidth && photoHeight ? photoHeight / photoWidth : DEFAULT_ASPECT,
    location:
      latitude !== null && longitude !== null
        ? { latitude, longitude, name: record.placeName ?? '' }
        : null,
    song:
      record.songTitle !== null && record.songUri !== null
        ? {
            title: record.songTitle,
            artist: record.songArtist ?? '',
            uri: record.songUri,
            artworkUrl: record.songArtworkUrl,
            startSec: record.songStartSec,
            endSec: record.songEndSec,
          }
        : null,
    chapter: record.chapter,
    uploader: record.uploader,
    likes: record._count.likes,
    likedByMe: record.likes.length > 0,
    comments: record._count.comments,
    createdAt: record.createdAt.toISOString(),
  };
}
