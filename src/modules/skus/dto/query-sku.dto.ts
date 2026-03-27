import { IsOptional, IsInt, IsString, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class QuerySkuDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search by SKU code or product name' })
  @IsOptional() @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  masterId?: number;

  @ApiPropertyOptional()
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  categoryId?: number;

  @ApiPropertyOptional({ enum: ['active', 'inactive'] })
  @IsOptional() @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';
}
