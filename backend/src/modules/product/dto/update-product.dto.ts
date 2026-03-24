import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

/**
 * Only non-SKU-defining fields can be updated.
 * SKU, categoryId, and attributes are IMMUTABLE after creation.
 * If a product's attributes change, it becomes a NEW product with a NEW SKU.
 */
export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
