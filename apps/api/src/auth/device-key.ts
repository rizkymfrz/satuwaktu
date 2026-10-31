const DEVICE_KEY_PATTERN = /^[A-Za-z0-9_-]{8,64}$/;

export function parseDeviceKey(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;
  return candidate && DEVICE_KEY_PATTERN.test(candidate) ? candidate : null;
}
