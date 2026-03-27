import { IsString, IsOptional, IsInt, Min, Length, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVariantValueDto {
  @ApiProperty({ example: 'Brass' })
  @IsString() @Length(1, 100)
  name: string;

  @ApiProperty({ example: 'BRS', description: '1-8 uppercase alphanumeric' })
  @IsString() @Matches(/^[A-Z0-9]{1,8}$/, { message: 'Code: 1-8 uppercase alphanumeric' })
  code: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString() @Length(0, 300)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsInt() @Min(0)
  sortOrder?: number;
}
