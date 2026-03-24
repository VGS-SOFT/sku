import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  const config  = app.get(ConfigService);
  const port    = config.get<number>('PORT') || 3001;
  const nodeEnv = config.get<string>('NODE_ENV') || 'development';
  const origins = (config.get<string>('CORS_ORIGINS') || 'http://localhost:3000').split(',').map(o => o.trim());

  // ── Security hardening ──────────────────────────────────────────────────
  app.use(helmet({
    contentSecurityPolicy:    nodeEnv === 'production',
    crossOriginEmbedderPolicy: nodeEnv === 'production',
  }));

  app.enableCors({
    origin:         origins,
    credentials:    true,
    methods:        ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  });

  app.use(cookieParser());
  app.use(compression());

  // ── API prefix + URI versioning ─────────────────────────────────────────
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // ── Global pipes, filters, interceptors ────────────────────────────────
  app.useGlobalPipes(new ValidationPipe({
    whitelist:              true,
    forbidNonWhitelisted:   true,
    transform:              true,
    transformOptions:       { enableImplicitConversion: true },
  }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor());

  // ── Swagger (dev + staging only, never production) ─────────────────────
  if (nodeEnv !== 'production') {
    const doc = new DocumentBuilder()
      .setTitle('SKU Engine API')
      .setDescription('Automated SKU Generation Engine — VGS IT SOLUTION')
      .setVersion('2.0')
      .addBearerAuth()
      .addCookieAuth('access_token')
      .build();
    SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, doc), {
      swaggerOptions: { persistAuthorization: true },
    });
    console.log(`\ud83d\udcd6 Swagger: http://localhost:${port}/api/docs`);
  }

  await app.listen(port);
  console.log(`\ud83d\ude80 SKU Engine API — port ${port} [${nodeEnv}]`);
}

bootstrap();
