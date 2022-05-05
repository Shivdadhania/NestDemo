import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, map } from 'rxjs';

@Injectable()
export class JsonResponseInterceptor implements NestInterceptor {
    public intercept(context: ExecutionContext, next: CallHandler<any>) {
        return next
            .handle()
            .pipe(
                map((data) => {
                    return {
                        isError: false,
                        message: data.message ?? '',
                        data: data.data,
                    };
                })
            )
            .pipe(
                catchError((err) => {
                    return Promise.reject(err);
                })
            );
    }
}