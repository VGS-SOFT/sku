import {
  Controller, Get, Post, Body, Patch,
  Param, Delete, ParseIntPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiResponse } from '../../common/response/api-response';

@Controller('categories')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    const data = await this.service.create(dto);
    return ApiResponse.success(data, 'Category created successfully');
  }

  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return ApiResponse.success(data);
  }

  @Get('tree')
  async getTree() {
    const data = await this.service.getTree();
    return ApiResponse.success(data);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.service.findOne(id);
    return ApiResponse.success(data);
  }

  @Get(':id/path')
  async getCategoryPath(@Param('id', ParseIntPipe) id: number) {
    const data = await this.service.getCategoryPath(id);
    return ApiResponse.success(data);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    const data = await this.service.update(id, dto);
    return ApiResponse.success(data, 'Category updated successfully');
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return ApiResponse.success(null, 'Category removed');
  }
}
