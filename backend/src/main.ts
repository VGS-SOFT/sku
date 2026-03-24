import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT', 3001);
  const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost:3000');

  // Global prefix for all API routes
  app.setGlobalPrefix('api');

  // Global validation pipe - validates all DTOs automatically
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // Strip unknown properties
      forbidNonWhitelisted: true,// Throw error on unknown properties
      transform: true,           // Auto-transform payloads to DTO instances
    }),
  );

  // CORS - allow frontend origin
  app.enableCors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    // NOTE: When auth is added, configure credentials: true here
  });

  await app.listen(port);
  console.log(`🚀 SKU Backend running on: http://localhost:${port}/api`);
  console.log(`📦 Environment: ${configService.get('APP_ENV')}`);
}

bootstrap();
