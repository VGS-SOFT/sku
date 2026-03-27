import { IsString, IsOptional, IsInt, Min, Length, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Poshak' })
  @IsString() @Length(1, 100)
  name: string;

  @ApiProperty({ example: 'PSK', description: '2-8 uppercase alphanumeric' })
  @IsString() @Matches(/^[A-Z0-9]{2,8}$/, { message: 'Code must be 2-8 uppercase alphanumeric' })
  code: string;

  @ApiProperty({ description: 'ID of parent Master' })
  @IsInt() @Min(1)
  masterId: number;

  @ApiPropertyOptional({ description: 'ID of parent Category (null = direct child of master)' })
  @IsOptional() @IsInt() @Min(1)
  parentId?: number;

  @ApiPropertyOptional()
  @IsOptional() @IsString() @Length(0, 500)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsInt() @Min(0)
  sortOrder?: number;
}
