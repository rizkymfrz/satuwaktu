import { Injectable, Logger } from '@nestjs/common';
import { Visibility } from '@repo/db';
import type { Principal } from '../auth/principal.js';
import { FragmentsService } from '../fragments/fragments.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { type PushContent, PushService } from './push.service.js';

const PREVIEW_LENGTH = 100;

type NotificationSetting = 'notifComment' | 'notifLike' | 'notifOnThisDay';

function previewOf(text: string) {
  return text.length > PREVIEW_LENGTH
    ? `${text.slice(0, PREVIEW_LENGTH).trimEnd()}…`
    : text;
}

function actorOf(principal: Principal) {
  return principal.role === 'owner' ? principal.accountId : undefined;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly push: PushService,
    private readonly fragments: FragmentsService,
  ) {}

  async registerToken(accountId: string, token: string) {
    const { db } = this.prisma;
    await db.accountSettings.upsert({
      where: { accountId },
      create: { accountId },
      update: {},
    });
    await db.pushDevice.upsert({
      where: { token },
      create: { accountId, token },
      update: { accountId },
    });
  }

  async unregisterToken(accountId: string, token: string) {
    await this.prisma.db.pushDevice.deleteMany({ where: { accountId, token } });
  }

  notifyCommentAdded(fragmentId: string, text: string, principal: Principal) {
    return this.deliver('notifComment', actorOf(principal), () => ({
      title: 'Titipan kata baru',
      body: previewOf(text),
      data: { fragmentId },
    }));
  }

  notifyLikeAdded(fragmentId: string, principal: Principal) {
    return this.deliver('notifLike', actorOf(principal), async () => {
      const fragment = await this.prisma.db.fragment.findUnique({
        where: { id: fragmentId },
        select: { caption: true },
      });
      return {
        title: 'Like baru',
        body: fragment?.caption
          ? `Seseorang menyukai "${previewOf(fragment.caption)}"`
          : 'Seseorang menyukai sebuah fragmen',
        data: { fragmentId },
      };
    });
  }

  notifyOnThisDay(now: Date) {
    return this.deliver('notifOnThisDay', undefined, async () => {
      const memory = await this.fragments.findOnThisDay(now, [
        Visibility.PUBLIC,
        Visibility.PRIVATE,
      ]);
      if (!memory) {
        return null;
      }
      return {
        title: 'Hari Ini Dulu',
        body: `${memory.yearsAgo} tahun lalu: ${previewOf(memory.caption) || 'sebuah kenangan'}`,
        data: { fragmentId: memory.id },
      };
    });
  }

  private async deliver(
    setting: NotificationSetting,
    excludeAccountId: string | undefined,
    build: () => PushContent | null | Promise<PushContent | null>,
  ) {
    try {
      const devices = await this.prisma.db.pushDevice.findMany({
        where: {
          account: { settings: { [setting]: true } },
          ...(excludeAccountId ? { accountId: { not: excludeAccountId } } : {}),
        },
        select: { token: true },
      });
      if (devices.length === 0) {
        return;
      }
      const content = await build();
      if (!content) {
        return;
      }
      await this.push.send(
        devices.map((device) => ({ to: device.token, ...content })),
        (tokens) => this.forgetTokens(tokens),
      );
    } catch (error) {
      this.logger.error(
        `Could not deliver ${setting} notification`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  private async forgetTokens(tokens: string[]) {
    await this.prisma.db.pushDevice.deleteMany({
      where: { token: { in: tokens } },
    });
  }
}
