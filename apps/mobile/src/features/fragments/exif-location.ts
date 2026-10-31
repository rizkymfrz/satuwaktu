type ExifData = Record<string, unknown> | null | undefined;
type Coordinates = { latitude: number; longitude: number };

function parseNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value !== "string") {
    return null;
  }
  const parts = value.split(",").map((part) => {
    const [top, bottom] = part.trim().split("/");
    const numerator = Number(top);
    const denominator = bottom === undefined ? 1 : Number(bottom);
    return denominator === 0 ? NaN : numerator / denominator;
  });
  if (parts.length === 0 || parts.some((part) => !Number.isFinite(part))) {
    return null;
  }
  const [degrees, minutes = 0, seconds = 0] = parts;
  return degrees + minutes / 60 + seconds / 3600;
}

function applyRef(value: number | null, ref: unknown, negative: string) {
  if (value === null) {
    return null;
  }
  const isNegative =
    typeof ref === "string" && ref.trim().toUpperCase().startsWith(negative);
  return isNegative ? -Math.abs(value) : value;
}

function extractTakenAt(exif: ExifData): Date | null {
  if (!exif) {
    return null;
  }
  const raw = exif.DateTimeOriginal ?? exif.DateTimeDigitized ?? exif.DateTime;
  if (typeof raw !== "string") {
    return null;
  }
  const match = raw
    .trim()
    .match(/^(\d{4})[:-](\d{2})[:-](\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
  if (!match) {
    return null;
  }
  const [year, month, day, hour, minute, second] = match.slice(1).map(Number);
  const date = new Date(year, month - 1, day, hour, minute, second);
  return Number.isNaN(date.getTime()) || year < 1970 ? null : date;
}

function extractGps(exif: ExifData): Coordinates | null {
  if (!exif) {
    return null;
  }
  const nested = (
    typeof exif.GPS === "object" && exif.GPS !== null ? exif.GPS : {}
  ) as Record<string, unknown>;
  const latitude = applyRef(
    parseNumber(exif.GPSLatitude ?? nested.Latitude),
    exif.GPSLatitudeRef ?? nested.LatitudeRef,
    "S",
  );
  const longitude = applyRef(
    parseNumber(exif.GPSLongitude ?? nested.Longitude),
    exif.GPSLongitudeRef ?? nested.LongitudeRef,
    "W",
  );
  if (latitude === null || longitude === null) {
    return null;
  }
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
    return null;
  }
  if (latitude === 0 && longitude === 0) {
    return null;
  }
  return { latitude, longitude };
}

export { extractGps, extractTakenAt };
