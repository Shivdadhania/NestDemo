import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService
    ) { };

    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;
        const salt = await bcrypt.genSalt();

        const hashPassword = await bcrypt.hash(password, salt);
        console.log(salt, hashPassword);
        const user = await this.usersRepository.create({ username, password: hashPassword });
        try {
            await this.usersRepository.save(user);
        } catch (error) {
            console.log(error);
        }

    };

    async findUser(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string; }> {
        const { username, password } = authCredentialsDto;

        const user = await this.usersRepository.findOne({
            where: {
                username: username
            }
        });
        if (user && (await bcrypt.compare(password, user.password))) {
            const payload: JwtPayload = { username };
            const accessToken: string = await this.jwtService.sign(payload);
            return { accessToken };
        } else {
            throw new UnauthorizedException('Please check your login credentials');
        }
    }
}
