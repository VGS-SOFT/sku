import {
  Controller, Post, Get, Body, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ImportService } from './import.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Import')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('import')
export class ImportController {
  constructor(private service: ImportService) {}

  @Roles(Role.ADMIN, Role.STAFF)
  @Post('resolve-keyword')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resolve a free-text keyword to a category or variant value' })
  resolveKeyword(@Body('keyword') keyword: string) {
    return this.service.resolveKeyword(keyword);
  }

  @Roles(Role.ADMIN, Role.STAFF)
  @Post('bulk-preview')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Preview bulk import rows — resolve categories + variants' })
  bulkPreview(@Body() body: { rows: any[] }) {
    return this.service.bulkPreview(body.rows);
  }

  @Roles(Role.ADMIN)
  @Post('keyword-mapping')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Save a keyword-to-entity mapping [ADMIN only]' })
  saveMapping(@Body() body: { keyword: string; entityType: string; entityId: number; priority?: number }) {
    return this.service.saveKeywordMapping(body.keyword, body.entityType, body.entityId, body.priority);
  }

  @Roles(Role.ADMIN)
  @Get('keyword-mappings')
  @ApiOperation({ summary: 'List all keyword mappings [ADMIN only]' })
  getMappings() {
    return this.service.getKeywordMappings();
  }
}
