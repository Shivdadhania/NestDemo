import * as express from 'express';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor() { }

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const req = ctx.getRequest<express.Request>();
        const errorData = exception.response;
        if (errorData) {
            return response.status(errorData.statusCode).json({
                isError: true,
                message: errorData.message,
                data: (exception).data || {},
            });
        }

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        if (exception instanceof HttpException) {
            status = exception.getStatus();
        } else {

        }

        return response.status(status).json({
            isError: true,
            message: exception.message || 'Internal server error',
            data: {},
        });
    }
}
