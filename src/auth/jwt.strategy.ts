import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
// import { GetUrl } from './get-user.decorator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        // @GetUrl() url: string,
        private userRepository: Repository<User>
    ) {
        // Logger.log(url);
        super({
            secretOrKey: 'topScret51',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    };

    async validate(payload: JwtPayload): Promise<User> {
        const { username } = payload;
        const user: User = await this.userRepository.findOne({
            where: {
                username: username
            }
        });
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    };
}