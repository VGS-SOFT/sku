import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuditService } from './audit.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Audit')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@Controller('audit')
export class AuditController {
  constructor(private service: AuditService) {}

  @Get()
  @ApiOperation({ summary: 'Get audit logs [ADMIN only]' })
  findAll(
    @Query('entityType') entityType?: string,
    @Query('entityId')   entityId?: string,
    @Query('limit')      limit?: string,
  ) {
    return this.service.findAll(
      entityType,
      entityId ? parseInt(entityId) : undefined,
      limit    ? parseInt(limit)    : 50,
    );
  }
}
