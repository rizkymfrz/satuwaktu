import {
  BadRequestException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { mkdtemp, readdir, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { pngHeader } from '../testing/png.js';
import { MediaService } from './media.service.js';

const CHANNELS = 3;
const ROTATE_CLOCKWISE_ORIENTATION = 6;

function noisyJpeg(width: number, height: number, orientation?: number) {
  return sharp(randomBytes(width * height * CHANNELS), {
    raw: { width, height, channels: CHANNELS },
  })
    .jpeg({ quality: 95 })
    .withMetadata(orientation ? { orientation } : {})
    .toBuffer();
}

describe('MediaService', () => {
  let dir: string;
  let media: MediaService;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'satuwaktu-media-'));
    process.env.UPLOAD_DIR = dir;
    media = new MediaService();
  });

  afterEach(async () => {
    delete process.env.UPLOAD_DIR;
    await rm(dir, { recursive: true, force: true });
  });

  it('keeps an image as is when it cannot be recompressed', async () => {
    const photo = await media.save(pngHeader(1200, 800));
    expect(photo).toMatchObject({ width: 1200, height: 800 });
    expect(photo.url).toMatch(/^\/v1\/media\/[0-9a-f-]{36}\.png$/);
    expect(await readdir(dir)).toHaveLength(1);
  });

  it('downsizes a large photo and stores it smaller as webp', async () => {
    const input = await noisyJpeg(3000, 2000);
    const photo = await media.save(input);
    expect(photo).toMatchObject({ width: 2048, height: 1365 });
    expect(photo.url).toMatch(/^\/v1\/media\/[0-9a-f-]{36}\.webp$/);
    const [name] = await readdir(dir);
    expect((await stat(join(dir, name!))).size).toBeLessThan(input.length);
  });

  it('does not enlarge a photo that is already small', async () => {
    const photo = await media.save(await noisyJpeg(640, 480));
    expect(photo).toMatchObject({ width: 640, height: 480 });
  });

  it('bakes the exif orientation into the stored pixels', async () => {
    const photo = await media.save(
      await noisyJpeg(800, 400, ROTATE_CLOCKWISE_ORIENTATION),
    );
    expect(photo).toMatchObject({ width: 400, height: 800 });
    await expect(media.inspect(photo.url)).resolves.toEqual({
      width: 400,
      height: 800,
    });
  });

  it('rejects data that is not a supported image', async () => {
    await expect(
      media.save(Buffer.from('definitely not an image')),
    ).rejects.toBeInstanceOf(UnsupportedMediaTypeException);
    expect(await readdir(dir)).toHaveLength(0);
  });

  it('inspects a stored photo by url', async () => {
    const { url } = await media.save(pngHeader(300, 450));
    await expect(media.inspect(url)).resolves.toEqual({
      width: 300,
      height: 450,
    });
  });

  it.each([
    ['an external url', 'https://example.com/a.png'],
    ['a path traversal', '/v1/media/../../etc/passwd'],
    ['an unknown file name', '/v1/media/not-a-uuid.png'],
  ])('refuses %s', async (_name, url) => {
    await expect(media.inspect(url)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('refuses a well formed url whose file does not exist', async () => {
    await expect(
      media.inspect('/v1/media/11111111-1111-1111-1111-111111111111.png'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('deletes a stored photo and tolerates a missing one', async () => {
    const { url } = await media.save(pngHeader(10, 10));
    await media.remove(url);
    await media.remove(url);
    await media.remove(null);
    await media.remove('https://example.com/a.png');
    expect(await readdir(dir)).toHaveLength(0);
  });

  it('only resolves safe file names to a path', () => {
    expect(media.pathFor('11111111-1111-1111-1111-111111111111.jpg')).toContain(
      dir,
    );
    expect(media.pathFor('../secret.png')).toBeNull();
    expect(media.pathFor('index.html')).toBeNull();
  });
});
