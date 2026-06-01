import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ChapterModule } from "./chapter/chapter.module";
import { FragmenModule } from "./fragmen/fragmen.module";
import { ResonansiModule } from "./resonansi/resonansi.module";
import { TitipanKataModule } from "./titipan-kata/titipan-kata.module";
import { MediaModule } from "./media/media.module";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { RequestIdMiddleware } from "./common/middleware/request-id.middleware";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate(config: Record<string, unknown>) {
        const required = ["DATABASE_URL", "JWT_SECRET"];
        for (const key of required) {
          if (!config[key]) throw new Error(`Missing required env var: ${key}`);
        }
        return config;
      },
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    PrismaModule,
    AuthModule,
    ChapterModule,
    FragmenModule,
    ResonansiModule,
    TitipanKataModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes("*path");
  }
}
