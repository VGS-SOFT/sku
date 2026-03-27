import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, ParseIntPipe,
  Res, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Role } from '@prisma/client';
import { Response } from 'express';
import { SkusService } from './skus.service';
import { CreateSkuDto, PreviewSkuDto } from './dto/create-sku.dto';
import { UpdateSkuDto } from './dto/update-sku.dto';
import { QuerySkuDto } from './dto/query-sku.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('SKUs')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('skus')
export class SkusController {
  constructor(private service: SkusService) {}

  @Throttle({ default: { ttl: 60, limit: 200 } })
  @Post('preview')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Preview generated SKU code without saving (200 req/min)' })
  preview(@Body() dto: PreviewSkuDto) { return this.service.preview(dto); }

  @Public()
  @Post('check-duplicate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check if a SKU code already exists (public)' })
  checkDuplicate(@Body('sku') sku: string) { return this.service.checkDuplicate(sku); }

  @Post()
  @ApiOperation({ summary: 'Generate and save SKU (ADMIN or STAFF)' })
  create(@Body() dto: CreateSkuDto, @CurrentUser() user: any) {
    return this.service.create(dto, user.sub);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all SKUs with filters and pagination (public)' })
  findAll(@Query() query: QuerySkuDto) { return this.service.findAll(query); }

  @Public()
  @Get('analytics')
  @ApiOperation({ summary: 'SKU analytics overview (public)' })
  analytics() { return this.service.getAnalytics(); }

  @Roles(Role.ADMIN, Role.STAFF)
  @Get('export')
  @ApiOperation({ summary: 'Export all SKUs as JSON for CSV generation [ADMIN/STAFF]' })
  async export(@Query() query: QuerySkuDto, @Res() res: Response) {
    const data = await this.service.exportData(query);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="skus-export.json"');
    res.json({ success: true, count: data.length, data });
  }

  @Public()
  @Get('by-code/:sku')
  @ApiOperation({ summary: 'Lookup SKU by its code string (public)' })
  findBySku(@Param('sku') sku: string) { return this.service.findBySku(sku); }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get SKU by numeric ID (public)' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update SKU metadata [ADMIN only]' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSkuDto) {
    return this.service.update(id, dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete SKU (code permanently reserved) [ADMIN only]' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
