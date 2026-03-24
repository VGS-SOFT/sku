import { Injectable, BadRequestException } from '@nestjs/common';
import { CategoryService } from '../category/category.service';
import { CodeRegistryService } from '../code-registry/code-registry.service';
import { CategoryAttributeSchema } from '../category/entities/category.entity';

export interface SkuAttributeInput {
  attributeType: string;   // e.g. "COLOR"
  code: string;            // e.g. "whtclr" - must exist in CodeRegistry
}

export interface SkuGenerateInput {
  categoryId: number;
  attributes: SkuAttributeInput[];
}

export interface SkuGenerateResult {
  sku: string;
  segments: string[];      // Individual parts before joining - for debugging
  categoryPath: string[];  // Category codes used
  attributeCodes: string[];// Attribute codes used in schema order
}

/**
 * SKU Engine - The Heart of the System.
 * 
 * This service is PURE LOGIC. It:
 * 1. Resolves the category path (root -> leaf) and extracts codes
 * 2. Loads the locked attribute schema for the leaf category
 * 3. Matches provided attribute values to schema order
 * 4. Uses placeholder code for missing optional attributes
 * 5. Joins everything with "-" separator
 * 
 * GUARANTEES:
 * - Same inputs ALWAYS produce same SKU (deterministic)
 * - Never skips a schema position (uses placeholder)
 * - All codes validated against registry before assembly
 * 
 * This service has NO direct DB writes - it only reads.
 * Writing (markAsUsed) is triggered by ProductService after save.
 */
@Injectable()
export class SkuEngineService {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly codeRegistryService: CodeRegistryService,
  ) {}

  async generate(input: SkuGenerateInput): Promise<SkuGenerateResult> {
    // Step 1: Get category path from root to leaf
    const categoryPath = await this.categoryService.getCategoryPath(input.categoryId);
    const leafCategory = categoryPath[categoryPath.length - 1];

    if (!leafCategory.isLeaf) {
      throw new BadRequestException(
        `Category "${leafCategory.name}" is not a leaf category. Products can only be assigned to leaf categories.`,
      );
    }

    // Step 2: Build category code segments (all codes in path)
    const categorySegments = categoryPath.map((cat) => cat.code.toLowerCase());

    // Step 3: Get the locked attribute schema (sorted by order)
    const schema = (leafCategory.attributeSchema || []).sort(
      (a, b) => a.order - b.order,
    );

    // Step 4: Build attribute segments in EXACT schema order
    const attributeSegments = await this.resolveAttributeSegments(
      schema,
      input.attributes,
    );

    // Step 5: Assemble final SKU
    const allSegments = [...categorySegments, ...attributeSegments];
    const sku = allSegments.join('-').toUpperCase();

    return {
      sku,
      segments: allSegments,
      categoryPath: categorySegments,
      attributeCodes: attributeSegments,
    };
  }

  private async resolveAttributeSegments(
    schema: CategoryAttributeSchema[],
    providedAttributes: SkuAttributeInput[],
  ): Promise<string[]> {
    const segments: string[] = [];

    for (const schemaItem of schema) {
      // Find if this attribute type was provided
      const provided = providedAttributes.find(
        (a) => a.attributeType.toUpperCase() === schemaItem.attributeType.toUpperCase(),
      );

      if (provided) {
        // Validate the code exists in the registry
        try {
          await this.codeRegistryService.findByCode(provided.code);
        } catch {
          throw new BadRequestException(
            `Attribute code "${provided.code}" for type "${schemaItem.attributeType}" does not exist in Code Registry. Register it first.`,
          );
        }
        segments.push(provided.code.toLowerCase());
      } else if (schemaItem.isRequired) {
        // Required attribute missing - hard error
        throw new BadRequestException(
          `Required attribute "${schemaItem.attributeLabel}" (type: ${schemaItem.attributeType}) is missing. Cannot generate SKU.`,
        );
      } else {
        // Optional attribute not provided - use placeholder (never skip!)
        segments.push(schemaItem.placeholderCode.toLowerCase());
      }
    }

    return segments;
  }

  /**
   * Preview SKU without saving anything.
   * Used by frontend to show real-time SKU preview as user fills the form.
   */
  async preview(input: SkuGenerateInput): Promise<SkuGenerateResult> {
    return this.generate(input);
  }
}
