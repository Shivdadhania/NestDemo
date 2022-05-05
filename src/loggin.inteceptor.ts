import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import * as express from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(this.constructor.name);

    public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest<express.Request>();
        return next
            .handle()
            .pipe(
                tap({
                    next: (result) => {
                        const res = context.switchToHttp().getResponse<express.Response>();
                        this.logger.debug(`response: ${req.method} ${req.url} ${req.ip}: ${res.statusCode} ${JSON.stringify(result)}`);
                        return result;
                    },
                    error: (error) => {
                        this.logger.log(`error: ${req.method} ${req.url} ${req.ip}: ${error}`);
                    },
                })
            );
    }
}

