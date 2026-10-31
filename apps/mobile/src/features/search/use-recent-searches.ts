import { useEffect, useState } from "react";
import { parseRecent, pushRecent } from "@/features/search/recent-searches";
import { getSecureItem, setSecureItem } from "@/lib/secure-storage";

const RECENT_SEARCHES_KEY = "recent-searches";

function useRecentSearches() {
  const [recent, setRecent] = useState<string[]>([]);
  useEffect(() => {
    let active = true;
    getSecureItem(RECENT_SEARCHES_KEY)
      .then((raw) => {
        if (active) {
          setRecent(parseRecent(raw));
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  const update = (next: string[]) => {
    setRecent(next);
    setSecureItem(RECENT_SEARCHES_KEY, JSON.stringify(next)).catch(() => {});
  };
  return {
    recent,
    add: (term: string) => update(pushRecent(recent, term)),
    remove: (term: string) => update(recent.filter((item) => item !== term)),
    clear: () => update([]),
  };
}

export { useRecentSearches };
