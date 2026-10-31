import { Module } from '@nestjs/common';
import { ArchiveController } from './archive.controller.js';
import { ArchiveService } from './archive.service.js';

@Module({
  controllers: [ArchiveController],
  providers: [ArchiveService],
})
export class ArchiveModule {}
