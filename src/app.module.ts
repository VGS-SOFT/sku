import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import configuration from './common/config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { MastersModule } from './modules/masters/masters.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { VariantsModule } from './modules/variants/variants.module';
import { SkusModule } from './modules/skus/skus.module';
import { ImportModule } from './modules/import/import.module';
import { AuditModule } from './modules/audit/audit.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { HealthModule } from './modules/health/health.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env'],
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ([{
        ttl:   cs.get<number>('THROTTLE_TTL')   ?? 60,
        limit: cs.get<number>('THROTTLE_LIMIT') ?? 100,
      }]),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (cs: ConfigService) => ({
        store: await redisStore({ url: cs.get<string>('REDIS_URL') || 'redis://localhost:6379' }),
        ttl: 300_000,
      }),
    }),
    PrismaModule,
    AuthModule,
    MastersModule,
    CategoriesModule,
    VariantsModule,
    SkusModule,
    ImportModule,
    AuditModule,
    TemplatesModule,
    HealthModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
