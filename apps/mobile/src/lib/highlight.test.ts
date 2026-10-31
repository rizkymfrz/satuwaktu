import { describe, expect, it } from "vitest";
import { splitByTerm } from "@/lib/highlight";

describe("splitByTerm", () => {
  it("returns the whole text when the term is empty", () => {
    expect(splitByTerm("Sore di pantai", "  ")).toEqual([
      { text: "Sore di pantai", match: false },
    ]);
  });
  it("marks every case-insensitive occurrence and keeps the original casing", () => {
    expect(splitByTerm("Pantai dan pantai", "PANTAI")).toEqual([
      { text: "Pantai", match: true },
      { text: " dan ", match: false },
      { text: "pantai", match: true },
    ]);
  });
  it("keeps text before and after the match", () => {
    expect(splitByTerm("Sore di pantai kita", "di")).toEqual([
      { text: "Sore ", match: false },
      { text: "di", match: true },
      { text: " pantai kita", match: false },
    ]);
  });
  it("does not treat regex characters as patterns", () => {
    expect(splitByTerm("harga (1+1)", "(1+1)")).toEqual([
      { text: "harga ", match: false },
      { text: "(1+1)", match: true },
    ]);
  });
  it("returns the text untouched when nothing matches", () => {
    expect(splitByTerm("kopi", "teh")).toEqual([
      { text: "kopi", match: false },
    ]);
  });
  it("returns an empty text segment for empty text", () => {
    expect(splitByTerm("", "a")).toEqual([{ text: "", match: false }]);
  });
});
