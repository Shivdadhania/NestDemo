import {
    NestInterceptor,
    ExecutionContext,
    Injectable,
    CallHandler,
    Logger
} from '@nestjs/common';
import * as express from 'express';
import { classToPlain } from 'class-transformer';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>) {
        const req = context.switchToHttp().getRequest<express.Request>();
        return next.handle().pipe(map((data) => {
            Logger.log(`response: ${req.method} ${req.url} ${req.ip}`);
        }));
    }
}