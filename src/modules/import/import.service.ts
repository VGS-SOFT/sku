import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CategoriesService } from '../categories/categories.service';
import { VariantsService } from '../variants/variants.service';
import { SkusService } from '../skus/skus.service';

@Injectable()
export class ImportService {
  constructor(
    private prisma: PrismaService,
    private categoriesService: CategoriesService,
    private variantsService: VariantsService,
    private skusService: SkusService,
  ) {}

  /**
   * Resolve a free-text keyword to a category or variant value.
   * Used by the frontend import wizard to map raw product descriptions.
   */
  async resolveKeyword(keyword: string) {
    const normalized = keyword.trim().toLowerCase();

    // 1. Check ImportKeyword table first (highest priority)
    const mapped = await this.prisma.importKeyword.findFirst({
      where: { keyword: normalized },
      orderBy: { priority: 'desc' },
    });
    if (mapped) return { type: mapped.entityType, id: mapped.entityId, source: 'keyword_map' };

    // 2. Try matching a category name
    const category = await this.prisma.category.findFirst({
      where: { name: { contains: normalized }, isActive: true },
    });
    if (category) return { type: 'category', id: category.id, name: category.name, source: 'category_match' };

    // 3. Try matching a variant value name
    const variantValue = await this.prisma.variantValue.findFirst({
      where: { name: { contains: normalized }, isActive: true },
      include: { variantType: true },
    });
    if (variantValue) return {
      type: 'variant_value',
      id: variantValue.id,
      name: variantValue.name,
      variantTypeId: variantValue.variantTypeId,
      variantTypeName: (variantValue as any).variantType?.name,
      source: 'variant_match',
    };

    return { type: null, id: null, source: 'no_match' };
  }

  async saveKeywordMapping(keyword: string, entityType: string, entityId: number, priority = 0) {
    return this.prisma.importKeyword.upsert({
      where: { keyword },
      update: { entityType, entityId, priority },
      create: { keyword, entityType, entityId, priority },
    });
  }

  async bulkPreview(rows: { productName: string; categoryHint?: string; variants?: Record<string, string> }[]) {
    const results = [];
    for (const row of rows) {
      try {
        const categoryMatch = row.categoryHint
          ? await this.resolveKeyword(row.categoryHint)
          : null;
        results.push({
          input: row,
          categoryResolved: categoryMatch,
          status: categoryMatch?.type === 'category' ? 'ready' : 'needs_review',
        });
      } catch {
        results.push({ input: row, status: 'error' });
      }
    }
    return { total: rows.length, results };
  }

  async getKeywordMappings() {
    return this.prisma.importKeyword.findMany({ orderBy: { priority: 'desc' } });
  }
}
