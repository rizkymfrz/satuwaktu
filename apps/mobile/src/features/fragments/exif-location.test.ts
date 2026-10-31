import { describe, expect, it } from "vitest";
import { extractGps, extractTakenAt } from "@/features/fragments/exif-location";

describe("extractGps", () => {
  it("returns null without exif data", () => {
    expect(extractGps(undefined)).toBeNull();
    expect(extractGps(null)).toBeNull();
    expect(extractGps({})).toBeNull();
  });
  it("reads decimal coordinates", () => {
    expect(
      extractGps({
        GPSLatitude: -6.2,
        GPSLongitude: 106.8,
      }),
    ).toEqual({ latitude: -6.2, longitude: 106.8 });
  });
  it("applies the S and W references", () => {
    expect(
      extractGps({
        GPSLatitude: 6.2,
        GPSLatitudeRef: "S",
        GPSLongitude: 106.8,
        GPSLongitudeRef: "W",
      }),
    ).toEqual({ latitude: -6.2, longitude: -106.8 });
  });
  it("parses degree, minute and second rationals", () => {
    const result = extractGps({
      GPSLatitude: "6/1,12/1,0/1",
      GPSLatitudeRef: "S",
      GPSLongitude: "106/1,48/1,0/1",
      GPSLongitudeRef: "E",
    });
    expect(result?.latitude).toBeCloseTo(-6.2);
    expect(result?.longitude).toBeCloseTo(106.8);
  });
  it("reads coordinates nested under GPS", () => {
    expect(extractGps({ GPS: { Latitude: 1, Longitude: 2 } })).toEqual({
      latitude: 1,
      longitude: 2,
    });
  });
  it("rejects out of range, zero and malformed coordinates", () => {
    expect(extractGps({ GPSLatitude: 91, GPSLongitude: 10 })).toBeNull();
    expect(extractGps({ GPSLatitude: 10, GPSLongitude: 181 })).toBeNull();
    expect(extractGps({ GPSLatitude: 0, GPSLongitude: 0 })).toBeNull();
    expect(extractGps({ GPSLatitude: "1/0", GPSLongitude: 10 })).toBeNull();
    expect(extractGps({ GPSLatitude: "abc", GPSLongitude: 10 })).toBeNull();
    expect(extractGps({ GPSLatitude: 10 })).toBeNull();
  });
});

describe("extractTakenAt", () => {
  it("parses DateTimeOriginal in local time", () => {
    const date = extractTakenAt({ DateTimeOriginal: "2024:03:05 14:07:09" });
    expect(date).toEqual(new Date(2024, 2, 5, 14, 7, 9));
  });
  it("falls back to DateTimeDigitized and DateTime", () => {
    expect(
      extractTakenAt({ DateTimeDigitized: "2024-03-05T01:02:03" }),
    ).toEqual(new Date(2024, 2, 5, 1, 2, 3));
    expect(extractTakenAt({ DateTime: "2020:01:01 00:00:00" })).toEqual(
      new Date(2020, 0, 1, 0, 0, 0),
    );
  });
  it("returns null for missing, malformed or pre-1970 values", () => {
    expect(extractTakenAt(undefined)).toBeNull();
    expect(extractTakenAt({})).toBeNull();
    expect(extractTakenAt({ DateTimeOriginal: 5 })).toBeNull();
    expect(extractTakenAt({ DateTimeOriginal: "not a date" })).toBeNull();
    expect(
      extractTakenAt({ DateTimeOriginal: "1960:01:01 00:00:00" }),
    ).toBeNull();
  });
});
