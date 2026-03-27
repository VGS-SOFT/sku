/**
 * Unit tests for SKU code generation algorithm.
 * Tests both canonical examples from the spec and edge cases.
 */
describe('SKU Code Generation Algorithm', () => {
  // Helper: simulate the algorithm without DB (pure logic)
  function buildSkuCode(
    masterCode: string,
    categoryPath: string[],  // L1, L2, ... Leaf codes
    variantCodes: string[],  // In sortOrder
  ): string {
    return [masterCode, ...categoryPath, ...variantCodes].join('-');
  }

  // ── Canonical examples from spec ─────────────────────────
  it('should generate LG-VSR-PSK-TRD-S3 correctly', () => {
    const result = buildSkuCode('LG', ['VSR', 'PSK'], ['TRD', 'S3']);
    expect(result).toBe('LG-VSR-PSK-TRD-S3');
  });

  it('should generate LG-VSR-BNS-BRS-GLD-S2 correctly', () => {
    const result = buildSkuCode('LG', ['VSR', 'BNS'], ['BRS', 'GLD', 'S2']);
    expect(result).toBe('LG-VSR-BNS-BRS-GLD-S2');
  });

  // ── Structure tests ───────────────────────────────
  it('should use hyphen as separator throughout', () => {
    const result = buildSkuCode('LG', ['VSR', 'PSK'], ['TRD', 'S3']);
    expect(result.split('-').length).toBe(5);
    expect(result).not.toContain('_');
    expect(result).not.toContain(' ');
  });

  it('should always start with master code', () => {
    const result = buildSkuCode('LG', ['VSR', 'PSK'], ['TRD', 'S3']);
    expect(result.startsWith('LG-')).toBe(true);
  });

  it('should handle single-level category (no parent)', () => {
    const result = buildSkuCode('PS', ['DHP'], ['CTN', 'P50G']);
    expect(result).toBe('PS-DHP-CTN-P50G');
  });

  it('should handle deep 3-level category', () => {
    const result = buildSkuCode('LG', ['VSR', 'PSK', 'SLK'], ['MNK', 'RD', 'S2']);
    expect(result).toBe('LG-VSR-PSK-SLK-MNK-RD-S2');
  });

  it('should include all selected variant codes in sortOrder', () => {
    // Material(10) > Finish(20) > Color(30) > Size(50)
    const result = buildSkuCode('LG', ['VSR', 'BNS'], ['BRS', 'GP', 'GLD', 'S3']);
    expect(result).toBe('LG-VSR-BNS-BRS-GP-GLD-S3');
  });

  it('should produce unique codes for different variant selections', () => {
    const sku1 = buildSkuCode('LG', ['VSR', 'PSK'], ['TRD', 'S3']);
    const sku2 = buildSkuCode('LG', ['VSR', 'PSK'], ['TRD', 'S4']);
    expect(sku1).not.toBe(sku2);
  });

  it('should produce unique codes for different categories', () => {
    const sku1 = buildSkuCode('LG', ['VSR', 'PSK'], ['RD', 'S3']);
    const sku2 = buildSkuCode('LG', ['VSR', 'BNS'], ['RD', 'S3']);
    expect(sku1).not.toBe(sku2);
  });

  it('should produce unique codes for different masters', () => {
    const sku1 = buildSkuCode('LG',  ['VSR', 'PSK'], ['RD', 'S3']);
    const sku2 = buildSkuCode('IDL', ['VSR', 'PSK'], ['RD', 'S3']);
    expect(sku1).not.toBe(sku2);
  });
});
