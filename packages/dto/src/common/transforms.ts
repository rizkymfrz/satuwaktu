export function trimmed({ value }: { value: unknown }) {
  return typeof value === "string" ? value.trim() : value;
}

export function collapsed({ value }: { value: unknown }) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : value;
}

export function toBoolean({ value }: { value: unknown }) {
  if (value === "true" || value === true) {
    return true;
  }
  if (value === "false" || value === false) {
    return false;
  }
  return value;
}
