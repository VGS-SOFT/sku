import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category, CategoryAttributeSchema } from './entities/category.entity';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category, CategoryAttributeSchema])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService], // Exported for SKU Engine
})
export class CategoryModule {}
