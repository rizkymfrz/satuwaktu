type TextSegment = { text: string; match: boolean };

function splitByTerm(text: string, term: string): TextSegment[] {
  const needle = term.trim().toLowerCase();
  if (!needle) {
    return [{ text, match: false }];
  }
  const haystack = text.toLowerCase();
  const segments: TextSegment[] = [];
  let cursor = 0;
  let found = haystack.indexOf(needle, cursor);
  while (found !== -1) {
    if (found > cursor) {
      segments.push({ text: text.slice(cursor, found), match: false });
    }
    segments.push({
      text: text.slice(found, found + needle.length),
      match: true,
    });
    cursor = found + needle.length;
    found = haystack.indexOf(needle, cursor);
  }
  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), match: false });
  }
  return segments.length > 0 ? segments : [{ text, match: false }];
}

export { splitByTerm };
export type { TextSegment };
