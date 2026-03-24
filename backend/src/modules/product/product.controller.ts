import {
  Controller, Get, Post, Body, Patch,
  Param, Delete, ParseIntPipe, Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiResponse } from '../../common/response/api-response';

@Controller('products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Post()
  async create(@Body() dto: CreateProductDto) {
    const data = await this.service.create(dto);
    return ApiResponse.success(data, 'Product created with SKU successfully');
  }

  @Get()
  async findAll(@Query('search') search?: string) {
    const data = search
      ? await this.service.search(search)
      : await this.service.findAll();
    return ApiResponse.success(data);
  }

  @Get('by-sku/:sku')
  async findBySku(@Param('sku') sku: string) {
    const data = await this.service.findBySku(sku);
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
    @Body() dto: UpdateProductDto,
  ) {
    const data = await this.service.update(id, dto);
    return ApiResponse.success(data, 'Product updated');
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return ApiResponse.success(null, 'Product removed');
  }
}
