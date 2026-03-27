import {
  Injectable, NotFoundException, ConflictException,
  BadRequestException, Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../../prisma/prisma.service';
import { CategoriesService } from '../categories/categories.service';
import { CreateSkuDto, PreviewSkuDto } from './dto/create-sku.dto';
import { UpdateSkuDto } from './dto/update-sku.dto';
import { QuerySkuDto } from './dto/query-sku.dto';
import { paginate, paginateMeta } from '../../common/dto/pagination.dto';

@Injectable()
export class SkusService {
  constructor(
    private prisma: PrismaService,
    private categoriesService: CategoriesService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  // ─── Core SKU Code Generation Algorithm ─────────────────────────────────
  async generateSkuCode(
    categoryId: number,
    variantSelections: { variantTypeId: number; variantValueId: number }[],
  ): Promise<string> {
    // 1. Resolve full ancestor chain
    const ancestors = await this.categoriesService.getAncestors(categoryId);
    const category  = await this.categoriesService.findOne(categoryId);
    const master    = await this.prisma.master.findUnique({ where: { id: category.masterId } });
    if (!master) throw new BadRequestException('Master not found');

    // Path segment: MasterCode-L1Code-L2Code-...-LeafCode
    const pathCodes = [
      master.code,
      ...(ancestors as any[]).map((a: any) => a.code),
      category.code,
    ];

    // 2. Variant codes ordered by variantType.sortOrder
    const variantTypes = await this.prisma.variantType.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: { values: true },
    });

    const variantCodes: string[] = [];
    for (const vt of variantTypes) {
      const sel = variantSelections.find((s) => s.variantTypeId === vt.id);
      if (!sel) continue;
      const val = vt.values.find((v) => v.id === sel.variantValueId);
      if (!val)
        throw new BadRequestException(
          `Variant value ${sel.variantValueId} not found in type "${vt.name}"`,
        );
      variantCodes.push(val.code);
    }

    // 3. Final SKU = path segments + variant codes joined by "-"
    return [...pathCodes, ...variantCodes].join('-');
  }

  async preview(dto: PreviewSkuDto) {
    const sku    = await this.generateSkuCode(dto.categoryId, dto.variants);
    const exists = await this.prisma.sku.findUnique({ where: { sku } });
    return {
      sku,
      isDuplicate: !!exists,
      existingProduct: exists?.productName ?? null,
    };
  }

  async checkDuplicate(skuCode: string) {
    const exists = await this.prisma.sku.findUnique({ where: { sku: skuCode } });
    return { exists: !!exists, product: exists ?? null };
  }

  async create(dto: CreateSkuDto, userId: number) {
    const skuCode = await this.generateSkuCode(dto.categoryId, dto.variants);
    const exists  = await this.prisma.sku.findUnique({ where: { sku: skuCode } });

    if (exists) {
      // Auto-suggest next available suffix
      let suffix = 1;
      let candidate = `${skuCode}-${String(suffix).padStart(2, '0')}`;
      while (await this.prisma.sku.findUnique({ where: { sku: candidate } })) {
        suffix++;
        candidate = `${skuCode}-${String(suffix).padStart(2, '0')}`;
      }
      throw new ConflictException({
        code: 'DUPLICATE_SKU',
        message: `SKU "${skuCode}" already exists for product: ${exists.productName}`,
        existingSku: skuCode,
        suggestion: candidate,
        existingProductName: exists.productName,
      });
    }

    return this.prisma.sku.create({
      data: {
        sku: skuCode,
        productName: dto.productName,
        description: dto.description,
        notes: dto.notes,
        categoryId: dto.categoryId,
        createdById: userId,
        variants: {
          create: dto.variants.map((v) => ({
            variantTypeId:  v.variantTypeId,
            variantValueId: v.variantValueId,
          })),
        },
      },
      include: {
        category: { include: { master: true } },
        createdBy: { select: { id: true, name: true, email: true } },
        variants: { include: { variantType: true, variantValue: true } },
      },
    });
  }

  async findAll(query: QuerySkuDto) {
    const { skip, take } = paginate(query.page, query.limit);
    const where: any = {};
    if (query.status === 'active')   where.isActive = true;
    if (query.status === 'inactive') where.isActive = false;
    if (query.categoryId)            where.categoryId = query.categoryId;
    if (query.masterId)              where.category = { masterId: query.masterId };
    if (query.search) {
      where.OR = [
        { sku:         { contains: query.search } },
        { productName: { contains: query.search } },
      ];
    }
    const [skus, total] = await Promise.all([
      this.prisma.sku.findMany({
        where, skip, take,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { include: { master: true } },
          createdBy: { select: { id: true, name: true } },
          variants: { include: { variantType: true, variantValue: true } },
        },
      }),
      this.prisma.sku.count({ where }),
    ]);
    return { success: true, data: skus, meta: paginateMeta(total, query.page!, query.limit!) };
  }

  async findOne(id: number) {
    const sku = await this.prisma.sku.findUnique({
      where: { id },
      include: {
        category: { include: { master: true } },
        createdBy: { select: { id: true, name: true, email: true } },
        variants: { include: { variantType: true, variantValue: true } },
      },
    });
    if (!sku) throw new NotFoundException('SKU not found');
    return sku;
  }

  async findBySku(skuCode: string) {
    const sku = await this.prisma.sku.findUnique({
      where: { sku: skuCode },
      include: {
        category: { include: { master: true } },
        createdBy: { select: { id: true, name: true } },
        variants: { include: { variantType: true, variantValue: true } },
      },
    });
    if (!sku) throw new NotFoundException(`SKU "${skuCode}" not found`);
    return sku;
  }

  async update(id: number, dto: UpdateSkuDto) {
    await this.findOne(id);
    return this.prisma.sku.update({
      where: { id },
      data: dto,
      include: {
        category: true,
        variants: { include: { variantType: true, variantValue: true } },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.sku.update({ where: { id }, data: { isActive: false } });
    return { message: 'SKU deactivated — code permanently reserved to prevent reuse' };
  }

  async getAnalytics() {
    const [totalActive, totalInactive, recentActivity] = await Promise.all([
      this.prisma.sku.count({ where: { isActive: true } }),
      this.prisma.sku.count({ where: { isActive: false } }),
      this.prisma.sku.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          category: { include: { master: true } },
          createdBy: { select: { name: true } },
        },
      }),
    ]);
    const perMaster = await this.prisma.master.findMany({
      where: { isActive: true },
      include: { _count: { select: { categories: true } } },
    });
    return { totalActive, totalInactive, total: totalActive + totalInactive, perMaster, recentActivity };
  }

  async exportData(query: QuerySkuDto) {
    const bigQuery = { ...query, limit: 10000, page: 1 };
    const result = await this.findAll(bigQuery);
    return (result as any).data;
  }
}
