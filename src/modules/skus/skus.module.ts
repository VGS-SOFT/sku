import { Module } from '@nestjs/common';
import { SkusController } from './skus.controller';
import { SkusService } from './skus.service';
import { SeedCheckService } from './seed-check.service';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [CategoriesModule],
  controllers: [SkusController],
  providers: [SkusService, SeedCheckService],
  exports: [SkusService],
})
export class SkusModule {}
