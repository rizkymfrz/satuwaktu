import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;
const SCHEME = "scrypt";

function derive(password: string, salt: Buffer, length: number) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, length, (error, key) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(key);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt, KEY_LENGTH);
  return `${SCHEME}$${salt.toString("base64")}$${key.toString("base64")}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [scheme, saltValue, keyValue] = stored.split("$");
  if (scheme !== SCHEME || !saltValue || !keyValue) {
    return false;
  }
  const expected = Buffer.from(keyValue, "base64");
  const actual = await derive(
    password,
    Buffer.from(saltValue, "base64"),
    expected.length,
  );
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
