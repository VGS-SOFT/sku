import { IsString, IsOptional, Length, Matches, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMasterDto {
  @ApiProperty({ example: 'Laddu Gopal ji' })
  @IsString()
  @Length(2, 100)
  name: string;

  @ApiProperty({ example: 'LG', description: '2-6 uppercase alphanumeric characters' })
  @IsString()
  @Matches(/^[A-Z0-9]{2,6}$/, { message: 'Code must be 2-6 uppercase alphanumeric characters' })
  code: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
