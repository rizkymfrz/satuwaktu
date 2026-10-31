import { describe, expect, it } from "vitest";
import { isHeifAsset } from "@/features/fragments/photo-format";

describe("isHeifAsset", () => {
  it("detects HEIC and HEIF by mime type, file name or uri", () => {
    expect(isHeifAsset({ uri: "content://x/1", mimeType: "image/heic" })).toBe(
      true,
    );
    expect(isHeifAsset({ uri: "content://x/1", mimeType: "image/heif" })).toBe(
      true,
    );
    expect(
      isHeifAsset({ uri: "content://x/1", fileName: "IMG_0001.HEIC" }),
    ).toBe(true);
    expect(isHeifAsset({ uri: "file:///cache/photo.heic?x=1" })).toBe(true);
  });
  it("leaves other formats alone", () => {
    expect(isHeifAsset({ uri: "file:///a.jpg", mimeType: "image/jpeg" })).toBe(
      false,
    );
    expect(isHeifAsset({ uri: "file:///a.png", fileName: "a.png" })).toBe(
      false,
    );
    expect(isHeifAsset({ uri: "content://x/1", mimeType: null })).toBe(false);
  });
});
