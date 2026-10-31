import { imageSize } from 'image-size';
import {
  BadRequestException,
  Injectable,
  Logger,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, stat, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { UploadedPhoto } from '@repo/dto';
import { API_PREFIX, MEDIA_ROUTE } from '../config/api.config.js';
import { resolveUploadDir } from '../config/env.config.js';

const MEDIA_URL_PREFIX = `/${API_PREFIX}/${MEDIA_ROUTE}/`;

const EXTENSION_BY_IMAGE_TYPE: Record<string, string> = {
  jpg: 'jpg',
  png: 'png',
  webp: 'webp',
  heif: 'heic',
};

const MEDIA_NAME_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp|heic)$/;

const FIRST_ROTATED_ORIENTATION = 5;
const MAX_PHOTO_EDGE_PX = 2048;
const PHOTO_QUALITY = 80;
const COMPRESSED_EXTENSION = 'webp';

interface MeasuredImage {
  extension: string;
  width: number;
  height: number;
}

interface StoredImage extends MeasuredImage {
  data: Buffer;
}

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  readonly uploadDir = resolveUploadDir();

  async save(buffer: Buffer): Promise<UploadedPhoto> {
    const original = this.measure(buffer);
    const { data, extension, width, height } = (await this.compress(
      buffer,
    )) ?? { ...original, data: buffer };
    const name = `${randomUUID()}.${extension}`;
    await mkdir(this.uploadDir, { recursive: true });
    await writeFile(join(this.uploadDir, name), data, { flag: 'wx' });
    return { url: `${MEDIA_URL_PREFIX}${name}`, width, height };
  }

  async inspect(url: string): Promise<{ width: number; height: number }> {
    const name = this.nameFromUrl(url);
    if (!name) {
      throw new BadRequestException('Unknown photo');
    }
    let buffer: Buffer;
    try {
      buffer = await readFile(join(this.uploadDir, name));
    } catch {
      throw new BadRequestException('Unknown photo');
    }
    const { width, height } = this.measure(buffer);
    return { width, height };
  }

  async remove(url: string | null | undefined) {
    const name = url ? this.nameFromUrl(url) : null;
    if (!name) {
      return;
    }
    try {
      await unlink(join(this.uploadDir, name));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        this.logger.warn(`Could not remove ${name}: ${String(error)}`);
      }
    }
  }

  pathFor(name: string): string | null {
    return MEDIA_NAME_PATTERN.test(name) ? join(this.uploadDir, name) : null;
  }

  async exists(path: string) {
    try {
      return (await stat(path)).isFile();
    } catch {
      return false;
    }
  }

  nameFromUrl(url: string): string | null {
    if (!url.startsWith(MEDIA_URL_PREFIX)) {
      return null;
    }
    const name = url.slice(MEDIA_URL_PREFIX.length);
    return MEDIA_NAME_PATTERN.test(name) ? name : null;
  }

  private async compress(buffer: Buffer): Promise<StoredImage | null> {
    try {
      const { default: sharp } = await import('sharp');
      const { data, info } = await sharp(buffer)
        .rotate()
        .resize({
          width: MAX_PHOTO_EDGE_PX,
          height: MAX_PHOTO_EDGE_PX,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: PHOTO_QUALITY })
        .toBuffer({ resolveWithObject: true });
      if (data.length >= buffer.length) {
        return null;
      }
      return {
        data,
        extension: COMPRESSED_EXTENSION,
        width: info.width,
        height: info.height,
      };
    } catch (error) {
      this.logger.warn(`Could not compress photo: ${String(error)}`);
      return null;
    }
  }

  private measure(buffer: Buffer): MeasuredImage {
    let info: ReturnType<typeof imageSize>;
    try {
      info = imageSize(buffer);
    } catch {
      throw new UnsupportedMediaTypeException('Unsupported image');
    }
    const extension = info.type
      ? EXTENSION_BY_IMAGE_TYPE[info.type]
      : undefined;
    if (!extension || !info.width || !info.height) {
      throw new UnsupportedMediaTypeException('Unsupported image');
    }
    const rotated = (info.orientation ?? 1) >= FIRST_ROTATED_ORIENTATION;
    return {
      extension,
      width: rotated ? info.height : info.width,
      height: rotated ? info.width : info.height,
    };
  }
}
