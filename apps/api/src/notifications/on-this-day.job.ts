import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ARCHIVE_TIME_ZONE } from '../config/archive.config.js';
import { NotificationsService } from './notifications.service.js';

@Injectable()
export class OnThisDayJob {
  constructor(private readonly notifications: NotificationsService) {}

  @Cron('0 8 * * *', { timeZone: ARCHIVE_TIME_ZONE })
  run() {
    return this.notifications.notifyOnThisDay(new Date());
  }
}
