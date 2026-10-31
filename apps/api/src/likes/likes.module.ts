import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { LikesController } from './likes.controller.js';
import { LikesService } from './likes.service.js';

@Module({
  imports: [NotificationsModule],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
