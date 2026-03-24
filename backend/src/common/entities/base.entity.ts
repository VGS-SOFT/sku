import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

/**
 * Base entity inherited by all entities.
 * Provides: id, createdAt, updatedAt, deletedAt (soft delete ready).
 * Soft delete means records are never physically deleted,
 * only marked with deletedAt — safe for audit trails and undo functionality.
 */
export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Soft delete support — when auth/roles added, pair with @UseInterceptors
  @DeleteDateColumn()
  deletedAt: Date;
}
