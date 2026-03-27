import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(data: {
    entityType: string;
    entityId: number;
    action: string;
    before?: any;
    after?: any;
    userId?: number;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return this.prisma.auditLog.create({ data });
  }

  async findAll(entityType?: string, entityId?: number, limit = 50) {
    const where: any = {};
    if (entityType) where.entityType = entityType;
    if (entityId)   where.entityId   = entityId;
    return this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }
}
