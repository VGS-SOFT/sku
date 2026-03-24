import {
  IsString, IsOptional, IsBoolean, IsInt,
  IsArray, ValidateNested, MaxLength, MinLength, Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AttributeSchemaItemDto {
  @IsString()
  attributeType: string;

  @IsString()
  attributeLabel: string;

  @IsInt()
  order: number;

  @IsBoolean()
  isRequired: boolean;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+$/, { message: 'Placeholder code must be lowercase alphanumeric' })
  placeholderCode?: string;
}

export class CreateCategoryDto {
  @IsString()
  @MaxLength(150)
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @Matches(/^[a-z0-9]+$/, {
    message: 'Code must be lowercase alphanumeric only',
  })
  code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  parentId?: number;

  @IsBoolean()
  isLeaf: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttributeSchemaItemDto)
  attributeSchema?: AttributeSchemaItemDto[];
}
