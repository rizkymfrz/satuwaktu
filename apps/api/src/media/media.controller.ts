import type { Response } from 'express';
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { MAX_UPLOAD_BYTES, UPLOAD_FIELD } from '@repo/dto';
import { OwnerOnly } from '../auth/owner.guard.js';
import { MEDIA_ROUTE, THROTTLE_WINDOW_MS } from '../config/api.config.js';
import { MediaService } from './media.service.js';

export const UPLOAD_LIMIT = 30;
const CACHE_CONTROL = 'public, max-age=31536000, immutable';

interface UploadedFileLike {
  buffer: Buffer;
}

@Controller()
export class MediaController {
  constructor(private readonly media: MediaService) {}

  @Post('uploads/photos')
  @OwnerOnly()
  @Throttle({ default: { limit: UPLOAD_LIMIT, ttl: THROTTLE_WINDOW_MS } })
  @UseInterceptors(
    FileInterceptor(UPLOAD_FIELD, {
      limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
    }),
  )
  upload(@UploadedFile() file: UploadedFileLike | undefined) {
    if (!file) {
      throw new BadRequestException('A "file" field is required');
    }
    return this.media.save(file.buffer);
  }

  @Get(`${MEDIA_ROUTE}/:name`)
  @SkipThrottle()
  async serve(@Param('name') name: string, @Res() response: Response) {
    const path = this.media.pathFor(name);
    if (!path || !(await this.media.exists(path))) {
      throw new NotFoundException('Media not found');
    }
    response.set('Cache-Control', CACHE_CONTROL);
    response.sendFile(path);
  }
}
