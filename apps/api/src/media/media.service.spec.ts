import {
  BadRequestException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pngHeader } from '../testing/png.js';
import { MediaService } from './media.service.js';

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

  it('stores an image under a random name and reports its size', async () => {
    const photo = await media.save(pngHeader(1200, 800));
    expect(photo).toMatchObject({ width: 1200, height: 800 });
    expect(photo.url).toMatch(/^\/v1\/media\/[0-9a-f-]{36}\.png$/);
    expect(await readdir(dir)).toHaveLength(1);
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
