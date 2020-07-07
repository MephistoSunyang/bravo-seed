// tslint:disable-next-line: no-import-side-effect
import 'reflect-metadata';

import dotenv from 'dotenv';
dotenv.config();

import bodyParser from 'body-parser';
import compression from 'compression';
import history from 'connect-history-api-fallback-exclusions';
import cookie from 'cookie-parser';
import httpContext from 'express-http-context';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import helmet from 'helmet';

import {
  ErrorExceptionFilter,
  ExceptionLogInterceptor,
  ExceptionModule,
  getPath,
  getRootPath,
  HttpExceptionFilter,
  InterceptorModule,
  isLocal,
  ResultInterceptor,
} from '@bravo/core';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import passport from 'passport';
import { AppModule } from './app.module';

const bootstrap = async () => {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const port = process.env.PORT ? Number(process.env.PORT) : 8080;
    const cookieSecret = String(process.env.COOKIE_SECRET);
    const sessionSecret = String(process.env.SESSION_SECRET);
    const rateLimitMax = process.env.PORT ? Number(process.env.RATE_LIMIT_MAX) : 600;
    const historyExclusions = String(process.env.HISTORY_EXCLUSIONS).split(',');

    app.set('trust proxy', true);

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(compression());
    app.use(cookie(cookieSecret));
    app.use(
      session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: true,
        cookie: {
          secure: isLocal() ? false : true,
        },
      }),
    );
    app.use(helmet());
    app.use(rateLimit({ max: rateLimitMax }));
    app.use(history({ exclusions: historyExclusions }));
    app.use(httpContext.middleware);
    app.use(passport.initialize());
    app.use(passport.session());

    app.useStaticAssets(getPath('client'));
    app.useStaticAssets(getRootPath('statics'));
    app.useStaticAssets(getRootPath('resources'), { prefix: '/resources' });

    app.useGlobalFilters(
      app.select(ExceptionModule).get(ErrorExceptionFilter),
      app.select(ExceptionModule).get(HttpExceptionFilter),
    );

    app.useGlobalInterceptors(
      app.select(InterceptorModule).get(ResultInterceptor),
      app.select(InterceptorModule).get(ExceptionLogInterceptor),
    );

    if (isLocal()) {
      const options = new DocumentBuilder()
        .setTitle('The bravo framework APIs documents')
        .setDescription('The bravo framework APIs description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
      const document = SwaggerModule.createDocument(app, options);
      SwaggerModule.setup('api/v1', app, document, { swaggerOptions: { docExpansion: 'none' } });
    }

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    await app.listen(port);
  } catch (error) {
    throw error;
  }
};

bootstrap();
