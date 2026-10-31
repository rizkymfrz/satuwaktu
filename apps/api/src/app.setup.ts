import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/all-exceptions.filter.js';
import { API_PREFIX } from './config/api.config.js';
import { corsOrigins } from './config/env.config.js';

export function configureApp(app: INestApplication) {
  app.setGlobalPrefix(`/${API_PREFIX}`);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableShutdownHooks();
  app.enableCors({ origin: corsOrigins() });
  return app;
}
