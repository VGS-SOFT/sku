import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Category, CategoryAttributeSchema } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(CategoryAttributeSchema)
    private readonly schemaRepo: Repository<CategoryAttributeSchema>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    // Check code uniqueness in category table
    const existing = await this.categoryRepo.findOne({ where: { code: dto.code } });
    if (existing) {
      throw new ConflictException(`Category code "${dto.code}" already exists`);
    }

    // Validate parent exists if provided
    if (dto.parentId) {
      const parent = await this.categoryRepo.findOne({ where: { id: dto.parentId } });
      if (!parent) throw new NotFoundException(`Parent category #${dto.parentId} not found`);
    }

    const category = this.categoryRepo.create({
      name: dto.name,
      code: dto.code.toLowerCase(),
      description: dto.description,
      parentId: dto.parentId,
      isLeaf: dto.isLeaf,
    });

    const saved = await this.categoryRepo.save(category);

    // Save attribute schema if provided (only for leaf categories)
    if (dto.isLeaf && dto.attributeSchema?.length) {
      await this.saveAttributeSchema(saved.id, dto.attributeSchema);
    }

    return this.findOne(saved.id);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepo.find({
      where: { isActive: true, parentId: IsNull() },
      relations: ['children', 'children.children', 'children.attributeSchema'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ['parent', 'children', 'attributeSchema'],
    });
    if (!category) throw new NotFoundException(`Category #${id} not found`);
    return category;
  }

  async getTree(): Promise<Category[]> {
    // Returns full N-level tree
    return this.categoryRepo.find({
      where: { isActive: true },
      relations: ['children', 'children.children', 'children.children.children', 'attributeSchema'],
      order: { name: 'ASC' },
    });
  }

  async getCategoryPath(id: number): Promise<Category[]> {
    /**
     * Returns the path from root to the given category.
     * Used by SKU Engine to build the category-code prefix of the SKU.
     * Example: [Vastra, CottonVastra] -> codes: [vst, ctnvst]
     */
    const path: Category[] = [];
    let current = await this.findOne(id);
    path.unshift(current);

    while (current.parentId) {
      current = await this.findOne(current.parentId);
      path.unshift(current);
    }
    return path;
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    Object.assign(category, dto);
    const saved = await this.categoryRepo.save(category);

    // Update attribute schema if provided
    if (dto.attributeSchema !== undefined) {
      // Remove existing schema and replace (safe since schema is config, not data)
      await this.schemaRepo.delete({ categoryId: id });
      if (dto.attributeSchema.length) {
        await this.saveAttributeSchema(id, dto.attributeSchema);
      }
    }

    return this.findOne(saved.id);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    if (category.children?.length) {
      throw new BadRequestException(
        `Cannot delete category "${category.name}" - it has child categories. Remove children first.`,
      );
    }
    await this.categoryRepo.softDelete(id);
  }

  private async saveAttributeSchema(
    categoryId: number,
    schema: CreateCategoryDto['attributeSchema'],
  ): Promise<void> {
    const entries = schema.map((item) =>
      this.schemaRepo.create({
        categoryId,
        attributeType: item.attributeType.toUpperCase(),
        attributeLabel: item.attributeLabel,
        order: item.order,
        isRequired: item.isRequired,
        placeholderCode: item.placeholderCode ?? 'na',
      }),
    );
    await this.schemaRepo.save(entries);
  }
}
