import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryCategoryDto {
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  masterId?: number;

  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt()
  parentId?: number;

  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(0)
  depth?: number;
}
