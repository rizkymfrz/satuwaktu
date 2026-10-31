import type { AudioPlayer, AudioStatus } from "expo-audio";
import { useIsFocused } from "expo-router";
import { useEffect, useRef } from "react";

function setPlayerLoop(player: AudioPlayer, loop: boolean) {
  player.loop = loop;
}

function useClippedLoop(
  player: AudioPlayer,
  status: AudioStatus,
  startSec: number,
  endSec: number | undefined,
) {
  const started = useRef(false);
  const resumeOnFocus = useRef(false);
  const focused = useIsFocused();
  const clipped = endSec !== undefined;
  useEffect(() => {
    setPlayerLoop(player, !clipped);
  }, [player, clipped]);
  useEffect(() => {
    if (focused && status.isLoaded && !started.current) {
      started.current = true;
      player.seekTo(startSec).then(() => player.play());
    }
  }, [focused, status.isLoaded, player, startSec]);
  useEffect(() => {
    if (!started.current) {
      return;
    }
    if (focused) {
      if (resumeOnFocus.current) {
        resumeOnFocus.current = false;
        player.play();
      }
      return;
    }
    resumeOnFocus.current = player.playing;
    player.pause();
  }, [focused, player]);
  useEffect(() => {
    if (!clipped || !started.current) {
      return;
    }
    if (
      status.didJustFinish ||
      (status.playing && status.currentTime >= endSec)
    ) {
      player.seekTo(startSec).then(() => player.play());
    }
  }, [
    clipped,
    endSec,
    startSec,
    player,
    status.didJustFinish,
    status.playing,
    status.currentTime,
  ]);
}

export { useClippedLoop };
