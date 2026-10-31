import type { PrismaService } from '../prisma/prisma.service.js';
import { SettingsService } from './settings.service.js';

const VIEW = {
  notifComment: true,
  notifLike: false,
  notifOnThisDay: true,
  dataSaver: false,
  autoSavePhotos: true,
  textSize: 'NORMAL',
  defaultVisibility: 'PUBLIC',
};

function setup() {
  const db = {
    accountSettings: { upsert: vi.fn().mockResolvedValue(VIEW) },
  };
  const service = new SettingsService({ db } as unknown as PrismaService);
  return { service, db };
}

describe('SettingsService', () => {
  it('creates the row with schema defaults when an account has none yet', async () => {
    const { service, db } = setup();
    const view = await service.get('akun-ann');
    expect(view).toEqual(VIEW);
    expect(db.accountSettings.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { accountId: 'akun-ann' },
        create: { accountId: 'akun-ann' },
        update: {},
      }),
    );
  });

  it('applies only the sent fields and keeps them on first creation', async () => {
    const { service, db } = setup();
    await service.update('akun-ann', {
      dataSaver: true,
      defaultVisibility: 'PRIVATE',
    });
    expect(db.accountSettings.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { accountId: 'akun-ann' },
        create: {
          accountId: 'akun-ann',
          dataSaver: true,
          defaultVisibility: 'PRIVATE',
        },
        update: { dataSaver: true, defaultVisibility: 'PRIVATE' },
      }),
    );
  });
});
