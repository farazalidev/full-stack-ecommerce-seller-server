import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { EmojiLogger } from './utils/Logger';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { join } from 'path';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new EmojiLogger(),
  });

  const path = join(__dirname, '/.env');

  dotenv.config({ path });

  app.use(cookieParser());
  app.use(bodyParser());
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
  });
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(4000);
}
bootstrap();
