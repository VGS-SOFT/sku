import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req   = ctx.switchToHttp().getRequest();
    const now   = Date.now();
    const route = `${req.method} ${req.url}`;
    return next.handle().pipe(
      tap(() => this.logger.log(`${route} — ${Date.now() - now}ms`)),
    );
  }
}
