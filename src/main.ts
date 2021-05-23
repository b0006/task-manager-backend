import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // for class-transformer and class-validator
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(4000);
}
bootstrap();
