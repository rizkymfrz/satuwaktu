import { useSyncExternalStore } from "react";

type Draft = { latitude: number; longitude: number } | null;

let draft: Draft = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return draft;
}

function setLocationDraft(next: Draft) {
  draft = next;
  listeners.forEach((listener) => listener());
}

function useLocationDraft() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export { setLocationDraft, useLocationDraft };
