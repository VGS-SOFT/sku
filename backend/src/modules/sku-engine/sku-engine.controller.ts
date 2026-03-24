import { Controller, Post, Body } from '@nestjs/common';
import { SkuEngineService, SkuGenerateInput } from './sku-engine.service';
import { ApiResponse } from '../../common/response/api-response';

@Controller('sku-engine')
export class SkuEngineController {
  constructor(private readonly skuEngineService: SkuEngineService) {}

  /**
   * POST /api/sku-engine/preview
   * Generates and returns SKU preview without saving anything.
   * Frontend calls this on every form change for real-time SKU display.
   */
  @Post('preview')
  async preview(@Body() input: SkuGenerateInput) {
    const data = await this.skuEngineService.preview(input);
    return ApiResponse.success(data, 'SKU preview generated');
  }
}
