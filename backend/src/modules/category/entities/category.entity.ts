import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

/**
 * Category is a self-referential N-level tree.
 * Each node can have a parent (making it a sub-category)
 * and a list of children (making it a parent category).
 * 
 * The `code` field stores the short code FROM CodeRegistry.
 * The full SKU path is assembled by walking from root to leaf.
 * 
 * Each leaf-level category has an AttributeSchema — the ordered
 * list of attribute types that products in this category must fill.
 */
@Entity('categories')
export class Category extends BaseEntity {
  @Column({ type: 'varchar', length: 150 })
  name: string;              // Full name: "Cotton Vastra"

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 20 })
  code: string;              // Short code: "ctnvst" - must exist in CodeRegistry

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isLeaf: boolean;           // True = this is the lowest level, products live here

  // Self-referential tree relationship
  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: 'RESTRICT',    // Prevent deleting parent if children exist
  })
  @JoinColumn({ name: 'parentId' })
  parent: Category;

  @Column({ nullable: true })
  parentId: number;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  // Attribute schema for this category (ordered list of required attributes)
  @OneToMany(() => CategoryAttributeSchema, (schema) => schema.category, {
    cascade: true,
  })
  attributeSchema: CategoryAttributeSchema[];
}

/**
 * CategoryAttributeSchema defines WHICH attributes and in WHAT ORDER
 * products under this category must specify.
 * 
 * This is what locks the SKU segment order per category.
 * Example for "Cotton Vastra": [Type(order:1), Color(order:2), Size(order:3)]
 * Example for "Laddu Gopal": [Material(order:1), Size(order:2), Color(order:3)]
 */
@Entity('category_attribute_schemas')
export class CategoryAttributeSchema extends BaseEntity {
  @ManyToOne(() => Category, (category) => category.attributeSchema, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  categoryId: number;

  @Column({ type: 'varchar', length: 50 })
  attributeType: string;     // e.g. "COLOR", "SIZE", "MATERIAL" - matches CodeType

  @Column({ type: 'varchar', length: 100 })
  attributeLabel: string;    // Human readable: "Color", "Size", "Material"

  @Column({ type: 'int' })
  order: number;             // Position in SKU - THIS IS WHAT LOCKS THE ORDER

  @Column({ type: 'boolean', default: false })
  isRequired: boolean;       // If false, uses placeholder code when not selected

  @Column({ type: 'varchar', length: 10, default: 'na' })
  placeholderCode: string;   // Used in SKU when attribute not applicable (e.g. 'na')
}
