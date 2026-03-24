import {
  IsString, IsOptional, IsInt, IsArray,
  ValidateNested, MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProductAttributeValueDto {
  @IsString()
  attributeType: string;   // e.g. "COLOR"

  @IsString()
  code: string;            // e.g. "whtclr" - must exist in CodeRegistry

  @IsOptional()
  @IsString()
  label?: string;          // e.g. "White Color" - for display only
}

export class CreateProductDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  categoryId: number;      // Must be a LEAF category

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeValueDto)
  attributes: ProductAttributeValueDto[];

  @IsOptional()
  @IsString()
  notes?: string;
}
