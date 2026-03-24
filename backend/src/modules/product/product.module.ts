import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SkuEngineModule } from '../sku-engine/sku-engine.module';
import { CodeRegistryModule } from '../code-registry/code-registry.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    SkuEngineModule,
    CodeRegistryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
