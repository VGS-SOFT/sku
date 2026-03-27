import { IsString, IsOptional, IsBoolean, IsInt, Min, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVariantTypeDto {
  @ApiProperty({ example: 'Material' })
  @IsString() @Length(2, 100)
  name: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString() @Length(0, 300)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsInt() @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional()
  @IsOptional() @IsBoolean()
  isRequired?: boolean;
}
