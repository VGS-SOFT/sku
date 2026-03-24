import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CodeRegistry, CodeType } from './entities/code-registry.entity';
import { CreateCodeRegistryDto } from './dto/create-code-registry.dto';
import { UpdateCodeRegistryDto } from './dto/update-code-registry.dto';

@Injectable()
export class CodeRegistryService {
  constructor(
    @InjectRepository(CodeRegistry)
    private readonly codeRegistryRepo: Repository<CodeRegistry>,
  ) {}

  async create(dto: CreateCodeRegistryDto): Promise<CodeRegistry> {
    // Enforce global uniqueness - check before insert
    const existing = await this.codeRegistryRepo.findOne({
      where: { code: dto.code.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException(
        `Code "${dto.code}" already exists (used by "${existing.label}"). Codes must be globally unique.`,
      );
    }

    const entry = this.codeRegistryRepo.create({
      ...dto,
      code: dto.code.toLowerCase(), // Always store lowercase
    });
    return this.codeRegistryRepo.save(entry);
  }

  async findAll(type?: CodeType): Promise<CodeRegistry[]> {
    const where: any = { isActive: true };
    if (type) where.type = type;
    return this.codeRegistryRepo.find({
      where,
      order: { type: 'ASC', label: 'ASC' },
    });
  }

  async findOne(id: number): Promise<CodeRegistry> {
    const entry = await this.codeRegistryRepo.findOne({ where: { id } });
    if (!entry) throw new NotFoundException(`Code registry entry #${id} not found`);
    return entry;
  }

  async findByCode(code: string): Promise<CodeRegistry> {
    const entry = await this.codeRegistryRepo.findOne({
      where: { code: code.toLowerCase() },
    });
    if (!entry) throw new NotFoundException(`Code "${code}" not found in registry`);
    return entry;
  }

  async update(id: number, dto: UpdateCodeRegistryDto): Promise<CodeRegistry> {
    const entry = await this.findOne(id);
    // Prevent editing a used code's label if it would cause confusion
    // Only label, description, isActive can change
    Object.assign(entry, dto);
    return this.codeRegistryRepo.save(entry);
  }

  async markAsUsed(code: string): Promise<void> {
    // Called by SKU Engine when a code is first used in a SKU
    await this.codeRegistryRepo.update(
      { code: code.toLowerCase() },
      { isUsed: true },
    );
  }

  async remove(id: number): Promise<void> {
    const entry = await this.findOne(id);
    if (entry.isUsed) {
      throw new BadRequestException(
        `Cannot delete code "${entry.code}" - it is already used in one or more SKUs. Deactivate it instead (set isActive: false).`,
      );
    }
    // Soft delete - sets deletedAt, record still exists in DB
    await this.codeRegistryRepo.softDelete(id);
  }
}
