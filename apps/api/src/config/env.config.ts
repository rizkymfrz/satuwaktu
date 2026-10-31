import { resolve } from 'node:path';

const MIN_SECRET_LENGTH = 32;
const DEFAULT_EXPIRES_IN = '30d';
const DEFAULT_PORT = 3000;
const DEFAULT_UPLOAD_DIR = 'uploads';

export function requireJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `JWT_SECRET must be set to at least ${MIN_SECRET_LENGTH} characters`,
    );
  }
  return secret;
}

export function jwtExpiresIn(): string {
  return process.env.JWT_EXPIRES_IN || DEFAULT_EXPIRES_IN;
}

export function listenPort() {
  return process.env.PORT ?? DEFAULT_PORT;
}

export function corsOrigins() {
  const origins = process.env.CORS_ORIGIN;
  return origins ? origins.split(',').map((origin) => origin.trim()) : true;
}

export function resolveUploadDir() {
  return resolve(process.env.UPLOAD_DIR || DEFAULT_UPLOAD_DIR);
}

export function expoAccessToken() {
  return process.env.EXPO_ACCESS_TOKEN;
}
