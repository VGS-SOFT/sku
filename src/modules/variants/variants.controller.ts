import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { VariantsService } from './variants.service';
import { CreateVariantTypeDto } from './dto/create-variant-type.dto';
import { CreateVariantValueDto } from './dto/create-variant-value.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Variants')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('variant-types')
export class VariantsController {
  constructor(private service: VariantsService) {}

  @Public() @Get()
  findAll() { return this.service.findAllTypes(); }

  @Public() @Get(':id/values')
  getValues(@Param('id', ParseIntPipe) id: number) { return this.service.getValues(id); }

  @Roles(Role.ADMIN) @Post()
  createType(@Body() dto: CreateVariantTypeDto) { return this.service.createType(dto); }

  @Roles(Role.ADMIN) @Patch(':id')
  updateType(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateVariantTypeDto>,
  ) { return this.service.updateType(id, dto); }

  @Roles(Role.ADMIN) @Delete(':id')
  deleteType(@Param('id', ParseIntPipe) id: number) { return this.service.deleteType(id); }

  @Roles(Role.ADMIN) @Post(':id/values')
  createValue(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateVariantValueDto,
  ) { return this.service.createValue(id, dto); }

  @Roles(Role.ADMIN) @Patch('values/:valueId')
  updateValue(
    @Param('valueId', ParseIntPipe) valueId: number,
    @Body() dto: Partial<CreateVariantValueDto>,
  ) { return this.service.updateValue(valueId, dto); }

  @Roles(Role.ADMIN) @Delete('values/:valueId')
  deleteValue(@Param('valueId', ParseIntPipe) valueId: number) {
    return this.service.deleteValue(valueId);
  }
}
