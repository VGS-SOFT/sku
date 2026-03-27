import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { SkusService } from './skus.service';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * On startup, validates the two canonical SKU examples from the spec:
 *   LG-VSR-PSK-TRD-S3     (Poshak, Transparent w/ Red Dots, Size 3)
 *   LG-VSR-BNS-BRS-GLD-S2 (Bansuri, Brass, Golden, Size 2)
 */
@Injectable()
export class SeedCheckService implements OnModuleInit {
  private readonly logger = new Logger(SeedCheckService.name);

  constructor(
    private skusService: SkusService,
    private prisma: PrismaService,
  ) {}

  async onModuleInit() {
    try {
      // Example 1: LG > VSR > PSK  +  Color=TRD, Size=S3
      const psk = await this.prisma.category.findFirst({ where: { code: 'PSK', isActive: true } });
      const trd = await this.prisma.variantValue.findFirst({ where: { code: 'TRD' } });
      const s3  = await this.prisma.variantValue.findFirst({ where: { code: 'S3'  } });
      if (psk && trd && s3) {
        const result = await this.skusService.generateSkuCode(psk.id, [
          { variantTypeId: trd.variantTypeId, variantValueId: trd.id },
          { variantTypeId: s3.variantTypeId,  variantValueId: s3.id  },
        ]);
        this.logger.log(`Seed check #1: ${result} ${result === 'LG-VSR-PSK-TRD-S3' ? '✅' : '❌ MISMATCH (expected LG-VSR-PSK-TRD-S3)'}`);
      }

      // Example 2: LG > VSR > BNS  +  Material=BRS, Color=GLD, Size=S2
      const bns = await this.prisma.category.findFirst({ where: { code: 'BNS', isActive: true } });
      const brs = await this.prisma.variantValue.findFirst({ where: { code: 'BRS' } });
      const gld = await this.prisma.variantValue.findFirst({ where: { code: 'GLD' } });
      const s2  = await this.prisma.variantValue.findFirst({ where: { code: 'S2'  } });
      if (bns && brs && gld && s2) {
        const result = await this.skusService.generateSkuCode(bns.id, [
          { variantTypeId: brs.variantTypeId, variantValueId: brs.id },
          { variantTypeId: gld.variantTypeId, variantValueId: gld.id },
          { variantTypeId: s2.variantTypeId,  variantValueId: s2.id  },
        ]);
        this.logger.log(`Seed check #2: ${result} ${result === 'LG-VSR-BNS-BRS-GLD-S2' ? '✅' : '❌ MISMATCH (expected LG-VSR-BNS-BRS-GLD-S2)'}`);
      }
    } catch {
      this.logger.warn('Seed check skipped — DB not seeded yet, run: npm run prisma:seed');
    }
  }
}
