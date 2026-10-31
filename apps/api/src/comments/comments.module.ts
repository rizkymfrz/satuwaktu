import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module.js';
import {
  CommentRepliesController,
  FragmentCommentsController,
} from './comments.controller.js';
import { CommentsService } from './comments.service.js';

@Module({
  imports: [NotificationsModule],
  controllers: [FragmentCommentsController, CommentRepliesController],
  providers: [CommentsService],
})
export class CommentsModule {}
