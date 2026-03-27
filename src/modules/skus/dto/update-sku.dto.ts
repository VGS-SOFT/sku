import { IsString, IsOptional, Length } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSkuDto {
  @ApiPropertyOptional()
  @IsOptional() @IsString() @Length(2, 300)
  productName?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString() @Length(0, 500)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString() @Length(0, 500)
  notes?: string;
}
