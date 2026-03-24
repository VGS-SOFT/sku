import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeRegistry } from './entities/code-registry.entity';
import { CodeRegistryService } from './code-registry.service';
import { CodeRegistryController } from './code-registry.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CodeRegistry])],
  controllers: [CodeRegistryController],
  providers: [CodeRegistryService],
  exports: [CodeRegistryService], // Exported so SKU Engine can use markAsUsed()
})
export class CodeRegistryModule {}
