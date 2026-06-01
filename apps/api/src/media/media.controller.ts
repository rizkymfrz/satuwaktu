import {
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerConfig } from "./multer.config";
import { MediaService } from "./media.service";

@Controller({ version: "1" })
export class MediaController {
  constructor(private media: MediaService) {}

  @Post("fragmen/:fragmenId/media")
  @UseInterceptors(FileInterceptor("file", multerConfig))
  upload(
    @Param("fragmenId") fragmenId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.media.upload(fragmenId, file);
  }

  @Delete("media/:id")
  delete(@Param("id") id: string) {
    return this.media.delete(id);
  }
}
