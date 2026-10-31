import { useSyncExternalStore } from "react";
import { Dimensions, type LayoutChangeEvent } from "react-native";

let bottomInset = 0;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return bottomInset;
}

function reportScreenLayout(event: LayoutChangeEvent) {
  const { y, height } = event.nativeEvent.layout;
  const next = Math.max(
    0,
    Math.round(Dimensions.get("window").height - (y + height)),
  );
  if (next === bottomInset) {
    return;
  }
  bottomInset = next;
  listeners.forEach((listener) => listener());
}

function useScreenBottomInset() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export { reportScreenLayout, useScreenBottomInset };
