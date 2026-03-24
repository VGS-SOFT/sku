import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SkuEngineService } from '../sku-engine/sku-engine.service';
import { CodeRegistryService } from '../code-registry/code-registry.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly skuEngineService: SkuEngineService,
    private readonly codeRegistryService: CodeRegistryService,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    // Step 1: Generate SKU deterministically
    const skuResult = await this.skuEngineService.generate({
      categoryId: dto.categoryId,
      attributes: dto.attributes,
    });

    // Step 2: Check for duplicate SKU (same product already exists)
    const existingProduct = await this.productRepo.findOne({
      where: { sku: skuResult.sku },
    });
    if (existingProduct) {
      throw new ConflictException(
        `SKU "${skuResult.sku}" already exists (Product: "${existingProduct.title}"). ` +
        `This means an identical product is already in the catalog.`,
      );
    }

    // Step 3: Create and save product
    const product = this.productRepo.create({
      title: dto.title,
      description: dto.description,
      categoryId: dto.categoryId,
      sku: skuResult.sku,
      attributeValues: dto.attributes,
      notes: dto.notes,
    });

    const saved = await this.productRepo.save(product);

    // Step 4: Mark all used codes as isUsed=true in registry
    // This locks them from deletion going forward
    const usedCodes = [...skuResult.categoryPath, ...skuResult.attributeCodes];
    for (const code of usedCodes) {
      if (code !== 'na') { // Don't mark placeholder
        await this.codeRegistryService.markAsUsed(code).catch(() => {
          // Code might already be marked, ignore error
        });
      }
    }

    return this.findOne(saved.id);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepo.find({
      where: { isActive: true },
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return product;
  }

  async findBySku(sku: string): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { sku: sku.toUpperCase() },
      relations: ['category'],
    });
    if (!product) throw new NotFoundException(`Product with SKU "${sku}" not found`);
    return product;
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    // Only update allowed fields - SKU/category/attributes are immutable
    Object.assign(product, dto);
    return this.productRepo.save(product);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.productRepo.softDelete(id);
  }

  async search(query: string): Promise<Product[]> {
    return this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.title LIKE :q OR product.sku LIKE :q', { q: `%${query}%` })
      .andWhere('product.isActive = true')
      .orderBy('product.createdAt', 'DESC')
      .getMany();
  }
}
