import { Module } from '@nestjs/common';
import { MediaModule } from '../media/media.module.js';
import { FragmentsController } from './fragments.controller.js';
import { FragmentsService } from './fragments.service.js';

@Module({
  imports: [MediaModule],
  controllers: [FragmentsController],
  providers: [FragmentsService],
  exports: [FragmentsService],
})
export class FragmentsModule {}
