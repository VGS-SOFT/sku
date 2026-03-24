import {
  ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx      = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request  = ctx.getRequest<Request>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    let code    = 'INTERNAL_ERROR';
    let field: string | undefined;

    if (exception instanceof HttpException) {
      const res = exception.getResponse() as Record<string, unknown>;
      if (typeof res === 'object' && res !== null) {
        if (Array.isArray(res['message'])) {
          message = (res['message'] as string[]).join('; ');
          code    = 'VALIDATION_ERROR';
        } else {
          message = (res['message'] as string)  || message;
          code    = (res['code']    as string)  || code;
          field   =  res['field']   as string | undefined;
        }
      }
    }

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} → ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json({
      success:   false,
      error:     { code, message, ...(field ? { field } : {}) },
      timestamp: new Date().toISOString(),
      path:      request.url,
    });
  }
}
