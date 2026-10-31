import { Injectable } from '@nestjs/common';
import type { SettingsView } from '@repo/dto';
import type { UpdateSettingsBody } from '@repo/dto/validation';
import { PrismaService } from '../prisma/prisma.service.js';

const SETTINGS_SELECT = {
  notifComment: true,
  notifLike: true,
  notifOnThisDay: true,
  dataSaver: true,
  autoSavePhotos: true,
  textSize: true,
  defaultVisibility: true,
} as const;

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  get(accountId: string): Promise<SettingsView> {
    return this.update(accountId, {});
  }

  update(accountId: string, body: UpdateSettingsBody): Promise<SettingsView> {
    return this.prisma.db.accountSettings.upsert({
      where: { accountId },
      create: { accountId, ...body },
      update: body,
      select: SETTINGS_SELECT,
    });
  }
}
