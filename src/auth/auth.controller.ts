import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { JsonResponseInterceptor } from '../json-response.interceptor';

@Controller('auth')
@UseInterceptors(JsonResponseInterceptor)
export class AuthController {

    constructor(
        private authService: AuthService
    ) { }

    @Post('/signup')
    signUp(
        @Body() authcredentialsDto: AuthCredentialsDto
    ): Promise<void> {
        return this.authService.createUser(authcredentialsDto);
    }

    @Post('/signin')
    signIn(
        @Body() authcredentialDto: AuthCredentialsDto
    ): Promise<{ accessToken: string; }> {
        return this.authService.findUser(authcredentialDto);
    }
}
