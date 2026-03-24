import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './modules/category/category.module';
import { CodeRegistryModule } from './modules/code-registry/code-registry.module';
import { ProductModule } from './modules/product/product.module';
import { SkuEngineModule } from './modules/sku-engine/sku-engine.module';

@Module({
  imports: [
    // Config module - loads .env globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database connection via TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_NAME', 'sku_db'),
        // Auto-create DB tables from entities in development
        // IMPORTANT: Set synchronize: false in production, use migrations
        synchronize: configService.get<string>('DB_SYNC', 'true') === 'true',
        autoLoadEntities: true,
        logging: configService.get('APP_ENV') === 'development',
        // charset for emoji and special char support
        charset: 'utf8mb4',
        // NOTE: When moving to production:
        // 1. Set DB_SYNC=false
        // 2. Run: npm run migration:generate && npm run migration:run
      }),
      inject: [ConfigService],
    }),

    // Feature modules
    CategoryModule,
    CodeRegistryModule,
    ProductModule,
    SkuEngineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
