import { Module } from '@nestjs/common';
import { SkuEngineService } from './sku-engine.service';
import { SkuEngineController } from './sku-engine.controller';
import { CategoryModule } from '../category/category.module';
import { CodeRegistryModule } from '../code-registry/code-registry.module';

@Module({
  imports: [
    CategoryModule,      // For getCategoryPath()
    CodeRegistryModule,  // For code validation + markAsUsed()
  ],
  controllers: [SkuEngineController],
  providers: [SkuEngineService],
  exports: [SkuEngineService], // Exported for ProductModule
})
export class SkuEngineModule {}
