import { ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new ConsoleLogger();
  const app = await NestFactory.create(AppModule, { logger });
  const configService = app.get(ConfigService);

  const port = configService.getOrThrow('PORT');

  await app.listen(port);

  logger.log(`Application listening on :${port}`, 'NestApplication');
}

bootstrap();
