import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMasterDto } from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';

const CACHE_KEY = 'masters:all';
const TREE_PREFIX = 'master:tree:';

@Injectable()
export class MastersService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async findAll() {
    const cached = await this.cache.get(CACHE_KEY);
    if (cached) return cached;
    const masters = await this.prisma.master.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { categories: true } } },
    });
    await this.cache.set(CACHE_KEY, masters, 300);
    return masters;
  }

  async findOne(id: number) {
    const master = await this.prisma.master.findUnique({ where: { id } });
    if (!master || !master.isActive) throw new NotFoundException('Master not found');
    return master;
  }

  async getTree(id: number) {
    const key = `${TREE_PREFIX}${id}`;
    const cached = await this.cache.get(key);
    if (cached) return cached;
    await this.findOne(id);
    const categories = await this.prisma.category.findMany({
      where: { masterId: id, isActive: true },
      orderBy: { path: 'asc' },
    });
    const tree = this.buildTree(categories, null);
    await this.cache.set(key, tree, 300);
    return tree;
  }

  private buildTree(cats: any[], parentId: number | null): any[] {
    return cats
      .filter((c) => c.parentId === parentId)
      .map((c) => ({ ...c, children: this.buildTree(cats, c.id) }));
  }

  async create(dto: CreateMasterDto) {
    const exists = await this.prisma.master.findUnique({ where: { code: dto.code } });
    if (exists)
      throw new ConflictException({
        code: 'DUPLICATE_CODE',
        message: `Master with code ${dto.code} already exists`,
        field: 'code',
      });
    const max = await this.prisma.master.aggregate({ _max: { sortOrder: true } });
    const sortOrder = dto.sortOrder ?? (max._max.sortOrder ?? 0) + 10;
    const master = await this.prisma.master.create({ data: { ...dto, sortOrder } });
    await this.invalidateCache();
    return master;
  }

  async update(id: number, dto: UpdateMasterDto) {
    await this.findOne(id);
    if (dto.code) {
      const dup = await this.prisma.master.findFirst({
        where: { code: dto.code, id: { not: id } },
      });
      if (dup)
        throw new ConflictException({
          code: 'DUPLICATE_CODE',
          message: `Code ${dto.code} already in use`,
          field: 'code',
        });
    }
    const updated = await this.prisma.master.update({ where: { id }, data: dto });
    await this.invalidateCache();
    return updated;
  }

  async remove(id: number) {
    await this.findOne(id);
    const activeSkus = await this.prisma.sku.count({
      where: { isActive: true, category: { masterId: id } },
    });
    if (activeSkus > 0)
      throw new BadRequestException({
        code: 'HAS_ACTIVE_SKUS',
        message: `Cannot delete: ${activeSkus} active SKUs reference this master`,
      });
    await this.prisma.category.updateMany({ where: { masterId: id }, data: { isActive: false } });
    await this.prisma.master.update({ where: { id }, data: { isActive: false } });
    await this.invalidateCache();
    return { message: 'Master soft-deleted successfully' };
  }

  async invalidateCache() {
    await this.cache.del(CACHE_KEY);
    const keys = await (this.cache.store as any).keys?.(`${TREE_PREFIX}*`) ?? [];
    for (const k of keys) await this.cache.del(k);
  }
}
