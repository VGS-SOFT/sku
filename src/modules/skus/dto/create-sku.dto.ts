import { IsString, IsInt, IsArray, ValidateNested, Min, IsOptional, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VariantSelectionDto {
  @ApiProperty({ description: 'VariantType ID' })
  @IsInt() @Min(1)
  variantTypeId: number;

  @ApiProperty({ description: 'VariantValue ID' })
  @IsInt() @Min(1)
  variantValueId: number;
}

export class CreateSkuDto {
  @ApiProperty({ example: 'Transparent Poshak Size 3' })
  @IsString() @Length(2, 300)
  productName: string;

  @ApiProperty({ description: 'Category ID (leaf level)' })
  @IsInt() @Min(1)
  categoryId: number;

  @ApiProperty({ type: [VariantSelectionDto] })
  @IsArray() @ValidateNested({ each: true }) @Type(() => VariantSelectionDto)
  variants: VariantSelectionDto[];

  @ApiPropertyOptional()
  @IsOptional() @IsString() @Length(0, 500)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString() @Length(0, 500)
  notes?: string;
}

export class PreviewSkuDto {
  @ApiProperty({ description: 'Category ID (leaf level)' })
  @IsInt() @Min(1)
  categoryId: number;

  @ApiProperty({ type: [VariantSelectionDto] })
  @IsArray() @ValidateNested({ each: true }) @Type(() => VariantSelectionDto)
  variants: VariantSelectionDto[];
}
