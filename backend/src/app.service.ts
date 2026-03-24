import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): object {
    return {
      status: 'ok',
      message: 'SKU Backend is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }
}
