import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Request, Response } from "express";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HTTP");

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = ctx.switchToHttp().getRequest<Request>();
    const { method, originalUrl } = req;
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const ms = Date.now() - start;
          const status = ctx.switchToHttp().getResponse<Response>().statusCode;
          this.logger.log(`${method} ${originalUrl} ${status} +${ms}ms`);
        },
        error: () => {
          const ms = Date.now() - start;
          this.logger.error(`${method} ${originalUrl} ERR +${ms}ms`);
        },
      }),
    );
  }
}
