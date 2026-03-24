import { IsString, IsEnum, IsOptional, Matches, MaxLength, MinLength } from 'class-validator';
import { CodeType } from '../entities/code-registry.entity';

export class CreateCodeRegistryDto {
  @IsString()
  @MaxLength(100)
  label: string;

  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @Matches(/^[a-z0-9]+$/, {
    message: 'Code must be lowercase alphanumeric only (no spaces, no special chars)',
  })
  code: string;

  @IsEnum(CodeType)
  type: CodeType;

  @IsOptional()
  @IsString()
  description?: string;
}
