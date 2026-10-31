import { describe, expect, it } from "vitest";
import {
  MAX_RECENT_SEARCHES,
  parseRecent,
  pushRecent,
} from "@/features/search/recent-searches";

describe("pushRecent", () => {
  it("puts the newest term first", () => {
    expect(pushRecent(["a", "b"], "c")).toEqual(["c", "a", "b"]);
  });
  it("moves an existing term to the front ignoring case", () => {
    expect(pushRecent(["Pantai", "kopi"], "pantai")).toEqual([
      "pantai",
      "kopi",
    ]);
  });
  it("ignores blank terms and trims the rest", () => {
    expect(pushRecent(["a"], "   ")).toEqual(["a"]);
    expect(pushRecent(["a"], "  b  ")).toEqual(["b", "a"]);
  });
  it("keeps only the most recent entries", () => {
    const full = Array.from(
      { length: MAX_RECENT_SEARCHES },
      (_, index) => `t${index}`,
    );
    const next = pushRecent(full, "baru");
    expect(next).toHaveLength(MAX_RECENT_SEARCHES);
    expect(next[0]).toBe("baru");
    expect(next).not.toContain(`t${MAX_RECENT_SEARCHES - 1}`);
  });
});

describe("parseRecent", () => {
  it("reads a stored list of strings", () => {
    expect(parseRecent('["a","b"]')).toEqual(["a", "b"]);
  });
  it("returns an empty list for missing, malformed or wrong-shaped data", () => {
    expect(parseRecent(null)).toEqual([]);
    expect(parseRecent("not json")).toEqual([]);
    expect(parseRecent('{"a":1}')).toEqual([]);
    expect(parseRecent('["a",1,null,"b"]')).toEqual(["a", "b"]);
  });
});
