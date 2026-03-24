import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { AttributeSchemaItemDto } from './create-category.dto';

/**
 * Code and parentId are immutable once products exist under the category.
 * Service layer enforces this check.
 */
export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isLeaf?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttributeSchemaItemDto)
  attributeSchema?: AttributeSchemaItemDto[];
}
