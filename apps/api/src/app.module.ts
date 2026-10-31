import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ArchiveModule } from './archive/archive.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ChaptersModule } from './chapters/chapters.module.js';
import { CommentsModule } from './comments/comments.module.js';
import { THROTTLE_WINDOW_MS } from './config/api.config.js';
import { FragmentsModule } from './fragments/fragments.module.js';
import { HealthModule } from './health/health.module.js';
import { LikesModule } from './likes/likes.module.js';
import { MediaModule } from './media/media.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ProfileModule } from './profile/profile.module.js';
import { SettingsModule } from './settings/settings.module.js';

const GLOBAL_LIMIT = 120;

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: THROTTLE_WINDOW_MS, limit: GLOBAL_LIMIT }],
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    HealthModule,
    FragmentsModule,
    LikesModule,
    MediaModule,
    CommentsModule,
    ChaptersModule,
    ArchiveModule,
    SettingsModule,
    NotificationsModule,
    ProfileModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
