import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { MastersService } from './masters.service';
import { CreateMasterDto } from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Masters')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('masters')
export class MastersController {
  constructor(private service: MastersService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all active masters (public)' })
  findAll() {
    return this.service.findAll();
  }

  @Public()
  @Get(':id/tree')
  @ApiOperation({ summary: 'Full nested category tree for a master (public)' })
  getTree(@Param('id', ParseIntPipe) id: number) {
    return this.service.getTree(id);
  }

  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a master category [ADMIN only]' })
  create(@Body() dto: CreateMasterDto) {
    return this.service.create(dto);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a master [ADMIN only]' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMasterDto) {
    return this.service.update(id, dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete a master [ADMIN only]' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
