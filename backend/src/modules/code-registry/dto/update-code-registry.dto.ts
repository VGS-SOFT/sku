import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

/**
 * Only label, description, and isActive can be updated.
 * `code` and `type` are IMMUTABLE once created.
 * `isUsed` is IMMUTABLE once true (set by system, not user).
 */
export class UpdateCodeRegistryDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  label?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
