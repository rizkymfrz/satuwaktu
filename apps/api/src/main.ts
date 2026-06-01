import {
  BadRequestException,
  Logger,
  ValidationPipe,
  VersioningType,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { join } from "path";
import { AppModule } from "./app.module";

const bootstrap = async () => {
  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(process.cwd(), "uploads"), { prefix: "/uploads" });

  app.use(helmet());
  app.use(cookieParser());

  app.enableVersioning({ type: VersioningType.URI });
  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const messages = errors.flatMap((e) =>
          Object.values(e.constraints ?? {}),
        );
        return new BadRequestException(messages.join(", "));
      },
    }),
  );

  const allowedOrigins = [
    "http://localhost:3000",
    "http://192.168.1.5:3000",
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
  ];
  app.enableCors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) cb(null, true);
      else cb(new Error("CORS: origin not allowed"));
    },
    credentials: true,
  });

  const port = process.env.PORT ?? "4000";
  await app.listen(port);
  logger.log(`API running on :${port}`);
};

void bootstrap();
