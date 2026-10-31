import type { PrismaService } from '../prisma/prisma.service.js';
import { ProfileService } from './profile.service.js';

function setup() {
  const db = {
    fragment: { count: vi.fn().mockResolvedValue(7) },
    like: { count: vi.fn().mockResolvedValue(21) },
    comment: { count: vi.fn().mockResolvedValue(4) },
  };
  const service = new ProfileService({ db } as unknown as PrismaService);
  return { service, db };
}

describe('ProfileService', () => {
  it('counts the own fragments of the account with their likes and comments', async () => {
    const { service, db } = setup();
    await expect(service.stats('akun-ann')).resolves.toEqual({
      fragmentCount: 7,
      likeCount: 21,
      commentCount: 4,
    });
    expect(db.fragment.count).toHaveBeenCalledWith({
      where: { uploaderId: 'akun-ann' },
    });
    expect(db.like.count).toHaveBeenCalledWith({
      where: { fragment: { uploaderId: 'akun-ann' } },
    });
    expect(db.comment.count).toHaveBeenCalledWith({
      where: { fragment: { uploaderId: 'akun-ann' } },
    });
  });
});
