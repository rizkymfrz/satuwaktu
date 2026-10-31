import { describe, expect, it } from "vitest";
import {
  daysSince,
  formatClock,
  formatMonthShort,
  formatRange,
  formatTime,
  formatWeekday,
  timeAgo,
} from "@/lib/format";

describe("formatClock", () => {
  it("formats seconds as m:ss and clamps negatives", () => {
    expect(formatClock(0)).toBe("0:00");
    expect(formatClock(65.9)).toBe("1:05");
    expect(formatClock(600)).toBe("10:00");
    expect(formatClock(-4)).toBe("0:00");
  });
});

describe("formatRange", () => {
  it("collapses a range inside one month", () => {
    const text = formatRange("2024-03-05T00:00:00", "2024-03-25T00:00:00");
    expect(text).not.toContain("–");
  });
  it("joins different months with an en dash", () => {
    const text = formatRange("2024-03-05T00:00:00", "2024-08-25T00:00:00");
    expect(text).toContain(" – ");
  });
});

describe("daysSince", () => {
  it("counts whole days and never goes negative", () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000 - 1000).toISOString();
    const future = new Date(Date.now() + 86400000).toISOString();
    expect(daysSince(twoDaysAgo)).toBe(2);
    expect(daysSince(future)).toBe(0);
  });
});

describe("timeAgo", () => {
  it("reports today for a fresh timestamp", () => {
    expect(timeAgo(new Date().toISOString())).toBe("Hari ini");
  });
  it("reports days for a recent timestamp", () => {
    const threeDays = new Date(Date.now() - 3 * 86400000 - 1000).toISOString();
    expect(timeAgo(threeDays)).toBe("3 hari lalu");
  });
});

describe("formatTime", () => {
  it("formats the local hour and minute with two digits", () => {
    expect(formatTime(new Date(2024, 2, 5, 4, 7).toISOString())).toBe("04.07");
    expect(formatTime(new Date(2024, 2, 5, 22, 30).toISOString())).toBe(
      "22.30",
    );
  });
});

describe("formatWeekday and formatMonthShort", () => {
  it("names the local weekday and abbreviated month in Indonesian", () => {
    const iso = new Date(2024, 2, 5, 12).toISOString();
    expect(formatWeekday(iso)).toBe("Selasa");
    expect(formatMonthShort(iso)).toBe("Mar");
  });
});
