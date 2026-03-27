import { Module } from '@nestjs/common';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';
import { SkusModule } from '../skus/skus.module';
import { CategoriesModule } from '../categories/categories.module';
import { VariantsModule } from '../variants/variants.module';

@Module({
  imports: [SkusModule, CategoriesModule, VariantsModule],
  controllers: [ImportController],
  providers: [ImportService],
  exports: [ImportService],
})
export class ImportModule {}
