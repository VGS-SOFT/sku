import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../response/api-response';

/**
 * Global HTTP exception filter.
 * Catches ALL exceptions and formats them using ApiResponse.
 * This ensures every error response has the same shape as success responses.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const errorDetail =
      exception instanceof HttpException
        ? JSON.stringify(exception.getResponse())
        : String(exception);

    console.error(`[${request.method}] ${request.url} - ${status}: ${errorDetail}`);

    response.status(status).json(
      ApiResponse.error(errorDetail, message)
    );
  }
}
