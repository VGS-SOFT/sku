import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, ParseIntPipe, Query,
} from '@nestjs/common';
import { CodeRegistryService } from './code-registry.service';
import { CreateCodeRegistryDto } from './dto/create-code-registry.dto';
import { UpdateCodeRegistryDto } from './dto/update-code-registry.dto';
import { CodeType } from './entities/code-registry.entity';
import { ApiResponse } from '../../common/response/api-response';

@Controller('code-registry')
export class CodeRegistryController {
  constructor(private readonly service: CodeRegistryService) {}

  @Post()
  async create(@Body() dto: CreateCodeRegistryDto) {
    const data = await this.service.create(dto);
    return ApiResponse.success(data, 'Code registered successfully');
  }

  @Get()
  async findAll(@Query('type') type?: CodeType) {
    const data = await this.service.findAll(type);
    return ApiResponse.success(data);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.service.findOne(id);
    return ApiResponse.success(data);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCodeRegistryDto,
  ) {
    const data = await this.service.update(id, dto);
    return ApiResponse.success(data, 'Code updated successfully');
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return ApiResponse.success(null, 'Code removed successfully');
  }
}
