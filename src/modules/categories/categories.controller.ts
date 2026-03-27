import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private service: CategoriesService) {}

  @Public() @Get()
  findAll(@Query() q: QueryCategoryDto) { return this.service.findAll(q); }

  @Public() @Get('tree')
  getTree() { return this.service.getFullTree(); }

  @Public() @Get(':id/ancestors')
  ancestors(@Param('id', ParseIntPipe) id: number) { return this.service.getAncestors(id); }

  @Public() @Get(':id/children')
  children(@Param('id', ParseIntPipe) id: number) { return this.service.getChildren(id); }

  @Roles(Role.ADMIN) @Post()
  @ApiOperation({ summary: 'Create category [ADMIN only]' })
  create(@Body() dto: CreateCategoryDto) { return this.service.create(dto); }

  @Roles(Role.ADMIN) @Patch(':id')
  @ApiOperation({ summary: 'Update category [ADMIN only]' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
    return this.service.update(id, dto);
  }

  @Roles(Role.ADMIN) @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete category + descendants [ADMIN only]' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
