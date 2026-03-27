import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId?: number) {
    return this.prisma.skuTemplate.findMany({
      where: { isActive: true, ...(userId ? { createdById: userId } : {}) },
      orderBy: { updatedAt: 'desc' },
      include: { createdBy: { select: { id: true, name: true } } },
    });
  }

  async findOne(id: number) {
    const t = await this.prisma.skuTemplate.findUnique({ where: { id } });
    if (!t || !t.isActive) throw new NotFoundException('Template not found');
    return t;
  }

  async create(data: { name: string; description?: string; categoryId?: number; variantData?: any }, userId: number) {
    return this.prisma.skuTemplate.create({
      data: { ...data, createdById: userId },
    });
  }

  async update(id: number, data: Partial<{ name: string; description: string; categoryId: number; variantData: any }>) {
    await this.findOne(id);
    return this.prisma.skuTemplate.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.skuTemplate.update({ where: { id }, data: { isActive: false } });
    return { message: 'Template deleted' };
  }
}
