import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
});

export const GetUrl = createParamDecorator((data, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest();
    return req.url;
});