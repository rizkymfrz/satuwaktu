const HEIF_PATTERN = /hei[cf]/i;

function isHeifAsset({
  uri,
  mimeType,
  fileName,
}: {
  uri: string;
  mimeType?: string | null;
  fileName?: string | null;
}) {
  return [mimeType, fileName, uri.split("?")[0]].some((value) =>
    HEIF_PATTERN.test(value ?? ""),
  );
}

export { isHeifAsset };
