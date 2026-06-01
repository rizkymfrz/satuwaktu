import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const isHttp = exception instanceof HttpException;
    const status = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string;
    if (isHttp) {
      const body = exception.getResponse();
      const raw =
        typeof body === "string"
          ? body
          : (body as { message: string | string[] }).message;
      message = Array.isArray(raw) ? raw.join(", ") : raw;
    } else {
      this.logger.error(
        `Unhandled ${req.method} ${req.originalUrl}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
      message = "Internal server error";
    }

    res.status(status).json({ success: false, data: null, message });
  }
}
