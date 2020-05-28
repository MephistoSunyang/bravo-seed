// tslint:disable-next-line: no-import-side-effect
import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

const bootstrap = async () => {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const port = process.env.PORT ? Number(process.env.PORT) : 8080;

    app.set('trust proxy', true);

    await app.listen(port);
  } catch (error) {
    throw error;
  }
};

bootstrap();
