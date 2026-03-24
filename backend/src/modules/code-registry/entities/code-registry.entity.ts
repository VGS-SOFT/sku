import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

/**
 * CodeRegistry is the GLOBAL immutable code store.
 * Every short code for every concept lives here.
 * 
 * Rules enforced:
 * - `code` is globally unique across all types (collision prevention)
 * - Once a code is `isUsed`, it cannot be edited or deleted
 * - `type` helps categorize what kind of thing the code represents
 */
export enum CodeType {
  CATEGORY = 'CATEGORY',
  MATERIAL = 'MATERIAL',
  PRODUCT_TYPE = 'PRODUCT_TYPE',
  COLOR = 'COLOR',
  STYLE = 'STYLE',
  FINISH = 'FINISH',
  SIZE = 'SIZE',
  CUSTOM = 'CUSTOM',       // For any future attribute type
}

@Entity('code_registry')
export class CodeRegistry extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  label: string;           // Human readable: "Cotton", "White Color"

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 20 })
  code: string;            // Short code: "ctn", "whtclr" - GLOBALLY UNIQUE

  @Column({ type: 'enum', enum: CodeType })
  type: CodeType;          // What kind of attribute this represents

  @Column({ type: 'text', nullable: true })
  description: string;     // Optional: notes about this code

  @Column({ type: 'boolean', default: false })
  isUsed: boolean;         // True once this code appears in any SKU
                           // IMMUTABLE after this point

  @Column({ type: 'boolean', default: true })
  isActive: boolean;       // False = deprecated (never delete, only deactivate)
}
