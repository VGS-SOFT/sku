import {
  Injectable, NotFoundException, ConflictException,
  BadRequestException, Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVariantTypeDto } from './dto/create-variant-type.dto';
import { CreateVariantValueDto } from './dto/create-variant-value.dto';

const VT_CACHE = 'variant-types:all';

@Injectable()
export class VariantsService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async findAllTypes() {
    const cached = await this.cache.get(VT_CACHE);
    if (cached) return cached;
    const types = await this.prisma.variantType.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        values: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
        _count: { select: { skuVariants: true } },
      },
    });
    await this.cache.set(VT_CACHE, types, 300);
    return types;
  }

  async findOneType(id: number) {
    const t = await this.prisma.variantType.findUnique({
      where: { id },
      include: { values: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
    });
    if (!t || !t.isActive) throw new NotFoundException('Variant type not found');
    return t;
  }

  async getValues(typeId: number) {
    await this.findOneType(typeId);
    return this.prisma.variantValue.findMany({
      where: { variantTypeId: typeId, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createType(dto: CreateVariantTypeDto) {
    const exists = await this.prisma.variantType.findUnique({ where: { name: dto.name } });
    if (exists)
      throw new ConflictException({ code: 'DUPLICATE_NAME', message: `Variant type "${dto.name}" already exists`, field: 'name' });
    const max = await this.prisma.variantType.aggregate({ _max: { sortOrder: true } });
    const sortOrder = dto.sortOrder ?? (max._max.sortOrder ?? 0) + 10;
    const created = await this.prisma.variantType.create({ data: { ...dto, sortOrder } });
    await this.cache.del(VT_CACHE);
    return created;
  }

  async updateType(id: number, dto: Partial<CreateVariantTypeDto>) {
    await this.findOneType(id);
    const updated = await this.prisma.variantType.update({ where: { id }, data: dto });
    await this.cache.del(VT_CACHE);
    return updated;
  }

  async deleteType(id: number) {
    await this.findOneType(id);
    const skuCount = await this.prisma.skuVariant.count({ where: { variantTypeId: id } });
    if (skuCount > 0)
      throw new BadRequestException({ code: 'HAS_SKUS', message: `${skuCount} SKUs use this variant type` });
    await this.prisma.variantType.update({ where: { id }, data: { isActive: false } });
    await this.cache.del(VT_CACHE);
    return { message: 'Variant type deleted' };
  }

  async createValue(typeId: number, dto: CreateVariantValueDto) {
    await this.findOneType(typeId);
    const exists = await this.prisma.variantValue.findFirst({
      where: { code: dto.code, variantTypeId: typeId },
    });
    if (exists)
      throw new ConflictException({ code: 'DUPLICATE_CODE', message: `Code "${dto.code}" exists in this type`, field: 'code' });
    const max = await this.prisma.variantValue.aggregate({
      where: { variantTypeId: typeId }, _max: { sortOrder: true },
    });
    const sortOrder = dto.sortOrder ?? (max._max.sortOrder ?? 0) + 10;
    const created = await this.prisma.variantValue.create({
      data: { ...dto, variantTypeId: typeId, sortOrder },
    });
    await this.cache.del(VT_CACHE);
    return created;
  }

  async updateValue(valueId: number, dto: Partial<CreateVariantValueDto>) {
    const v = await this.prisma.variantValue.findUnique({ where: { id: valueId } });
    if (!v || !v.isActive) throw new NotFoundException('Variant value not found');
    const updated = await this.prisma.variantValue.update({ where: { id: valueId }, data: dto });
    await this.cache.del(VT_CACHE);
    return updated;
  }

  async deleteValue(valueId: number) {
    const v = await this.prisma.variantValue.findUnique({ where: { id: valueId } });
    if (!v || !v.isActive) throw new NotFoundException('Variant value not found');
    const skuCount = await this.prisma.skuVariant.count({ where: { variantValueId: valueId } });
    if (skuCount > 0)
      throw new BadRequestException({ code: 'HAS_SKUS', message: `${skuCount} SKUs use this value` });
    await this.prisma.variantValue.update({ where: { id: valueId }, data: { isActive: false } });
    await this.cache.del(VT_CACHE);
    return { message: 'Variant value deleted' };
  }
}
