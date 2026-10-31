import { describe, expect, it } from "vitest";
import type { Fragment } from "@/features/archive/types";
import { groupByMonth } from "@/features/timeline/group-by-month";

function fragment(id: string, takenAt: string): Fragment {
  return {
    id,
    caption: "",
    chapter: null,
    uploader: { id: "u", name: "u" },
    takenAt,
    pinned: false,
    visibility: "PUBLIC",
    likes: 0,
    photoUrl: null,
    location: null,
    song: null,
    aspect: 1,
  };
}

describe("groupByMonth", () => {
  it("returns no rows for no fragments", () => {
    expect(groupByMonth([], false)).toEqual([]);
  });
  it("sorts newest first and inserts one header per month with its count", () => {
    const rows = groupByMonth(
      [
        fragment("old", "2024-01-10T12:00:00"),
        fragment("new-a", "2024-03-20T12:00:00"),
        fragment("new-b", "2024-03-05T12:00:00"),
      ],
      false,
    );
    expect(rows.map((row) => row.type)).toEqual([
      "header",
      "item",
      "item",
      "header",
      "item",
    ]);
    const headers = rows.filter((row) => row.type === "header");
    expect(headers.map((row) => row.count)).toEqual([2, 1]);
    const items = rows.flatMap((row) =>
      row.type === "item" ? [row.fragment.id] : [],
    );
    expect(items).toEqual(["new-a", "new-b", "old"]);
  });
  it("marks only the last header as partial when more pages exist", () => {
    const rows = groupByMonth(
      [
        fragment("a", "2024-03-20T12:00:00"),
        fragment("b", "2024-01-10T12:00:00"),
      ],
      true,
    );
    const headers = rows.filter((row) => row.type === "header");
    expect(headers.map((row) => row.partial)).toEqual([false, true]);
  });
  it("does not mark headers partial when all pages are loaded", () => {
    const rows = groupByMonth([fragment("a", "2024-03-20T12:00:00")], false);
    expect(rows.every((row) => row.type !== "header" || !row.partial)).toBe(
      true,
    );
  });
});
