import {
  Injectable, NotFoundException, ConflictException,
  BadRequestException, Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { MastersService } from '../masters/masters.service';

const TREE_CACHE = 'categories:tree';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private mastersService: MastersService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async findAll(query: QueryCategoryDto) {
    const where: any = { isActive: true };
    if (query.masterId !== undefined) where.masterId = query.masterId;
    if (query.parentId !== undefined) where.parentId = query.parentId;
    if (query.depth    !== undefined) where.depth    = query.depth;
    return this.prisma.category.findMany({ where, orderBy: { path: 'asc' } });
  }

  async getFullTree() {
    const cached = await this.cache.get(TREE_CACHE);
    if (cached) return cached;
    const masters = await this.prisma.master.findMany({
      where: { isActive: true }, orderBy: { sortOrder: 'asc' },
    });
    const cats = await this.prisma.category.findMany({
      where: { isActive: true }, orderBy: { path: 'asc' },
    });
    const result = masters.map((m) => ({
      ...m,
      children: this.buildTree(cats.filter((c) => c.masterId === m.id), null),
    }));
    await this.cache.set(TREE_CACHE, result, 300);
    return result;
  }

  private buildTree(cats: any[], parentId: number | null): any[] {
    return cats
      .filter((c) => c.parentId === parentId)
      .map((c) => ({ ...c, children: this.buildTree(cats, c.id) }));
  }

  async findOne(id: number) {
    const cat = await this.prisma.category.findUnique({ where: { id } });
    if (!cat || !cat.isActive) throw new NotFoundException('Category not found');
    return cat;
  }

  async getAncestors(id: number) {
    const cat = await this.findOne(id);
    if (!cat.path) return [];
    const ids = cat.path.split('.').map(Number);
    const ancestors = await this.prisma.category.findMany({ where: { id: { in: ids } } });
    return ids.map((i) => ancestors.find((a) => a.id === i)).filter(Boolean);
  }

  async getChildren(id: number) {
    await this.findOne(id);
    return this.prisma.category.findMany({
      where: { parentId: id, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async create(dto: CreateCategoryDto) {
    await this.mastersService.findOne(dto.masterId);
    let depth = 0;
    let parentPath: string | null = null;
    if (dto.parentId) {
      const parent = await this.findOne(dto.parentId);
      if (parent.masterId !== dto.masterId)
        throw new BadRequestException('Parent category must belong to same master');
      depth = parent.depth + 1;
      parentPath = parent.path;
    }
    const dupCheck = await this.prisma.category.findFirst({
      where: { code: dto.code, parentId: dto.parentId ?? null, isActive: true },
    });
    if (dupCheck)
      throw new ConflictException({
        code: 'DUPLICATE_CODE',
        message: `Code ${dto.code} already exists under this parent`,
        field: 'code',
      });
    const created = await this.prisma.category.create({
      data: { ...dto, depth, path: '0', sortOrder: dto.sortOrder ?? 0 },
    });
    const path = parentPath ? `${parentPath}.${created.id}` : `${created.id}`;
    const updated = await this.prisma.category.update({ where: { id: created.id }, data: { path } });
    await this.invalidateCache();
    return updated;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const cat = await this.findOne(id);
    if (dto.code && dto.code !== cat.code) {
      const dup = await this.prisma.category.findFirst({
        where: { code: dto.code, parentId: cat.parentId, id: { not: id } },
      });
      if (dup)
        throw new ConflictException({
          code: 'DUPLICATE_CODE',
          message: `Code ${dto.code} already used at this level`,
          field: 'code',
        });
    }
    const updated = await this.prisma.category.update({ where: { id }, data: dto });
    await this.invalidateCache();
    return updated;
  }

  async remove(id: number) {
    const cat = await this.findOne(id);
    const activeSkus = await this.prisma.sku.count({
      where: { isActive: true, category: { path: { startsWith: cat.path } } },
    });
    if (activeSkus > 0)
      throw new BadRequestException({
        code: 'HAS_ACTIVE_SKUS',
        message: `Cannot delete: ${activeSkus} active SKUs exist under this category`,
      });
    await this.prisma.category.updateMany({
      where: { path: { startsWith: cat.path } },
      data: { isActive: false },
    });
    await this.invalidateCache();
    return { message: 'Category and all descendants soft-deleted' };
  }

  async invalidateCache() {
    await this.cache.del(TREE_CACHE);
    await this.mastersService.invalidateCache();
  }
}
