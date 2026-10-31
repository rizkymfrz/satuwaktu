const MAX_RECENT_SEARCHES = 8;

function pushRecent(list: string[], term: string) {
  const clean = term.trim();
  if (!clean) {
    return list;
  }
  const rest = list.filter(
    (item) => item.toLowerCase() !== clean.toLowerCase(),
  );
  return [clean, ...rest].slice(0, MAX_RECENT_SEARCHES);
}

function parseRecent(raw: string | null) {
  if (!raw) {
    return [];
  }
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) {
      return [];
    }
    return value
      .filter((item): item is string => typeof item === "string")
      .slice(0, MAX_RECENT_SEARCHES);
  } catch {
    return [];
  }
}

export { MAX_RECENT_SEARCHES, parseRecent, pushRecent };
