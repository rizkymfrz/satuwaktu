import { BadRequestException } from '@nestjs/common';
import type { LocationBody, SongBody } from '@repo/dto/validation';

export function toLocationData(location: LocationBody | null | undefined) {
  if (location === undefined) {
    return {};
  }
  if (location === null) {
    return { latitude: null, longitude: null, placeName: null };
  }
  return {
    latitude: location.latitude,
    longitude: location.longitude,
    placeName: location.name?.trim() || null,
  };
}

export function toSongData(song: SongBody | null | undefined) {
  if (song === undefined) {
    return {};
  }
  if (song === null) {
    return {
      songTitle: null,
      songArtist: null,
      songUri: null,
      songArtworkUrl: null,
      songStartSec: null,
      songEndSec: null,
    };
  }
  const { startSec, endSec } = song;
  if (startSec !== undefined && endSec !== undefined && endSec <= startSec) {
    throw new BadRequestException('Song clip must end after it starts');
  }
  return {
    songTitle: song.title,
    songArtist: song.artist ?? '',
    songUri: song.uri,
    songArtworkUrl: song.artworkUrl ?? null,
    songStartSec: startSec ?? null,
    songEndSec: endSec ?? null,
  };
}
