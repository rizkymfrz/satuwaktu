import { Module } from '@nestjs/common';
import { FragmentsModule } from '../fragments/fragments.module.js';
import { NotificationsController } from './notifications.controller.js';
import { NotificationsService } from './notifications.service.js';
import { OnThisDayJob } from './on-this-day.job.js';
import { PushService } from './push.service.js';

@Module({
  imports: [FragmentsModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, PushService, OnThisDayJob],
  exports: [NotificationsService],
})
export class NotificationsModule {}
