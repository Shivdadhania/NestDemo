import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';
import { GetUrl } from './auth/get-user.decorator';
import { LoggingInterceptor } from './loggin.inteceptor';
import { AllExceptionsFilter } from './all-exceptional-filters';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
    const logger = new Logger('bootstrap');

    const app = await NestFactory.create(AppModule);
    app.enableCors();
    // app.useGlobalInterceptors(new LoggingInterceptor());
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new AllExceptionsFilter());
    // app.useGlobalInterceptors(new TransformInterceptor);
    await app.listen(process.env.PORT);
}
bootstrap();
