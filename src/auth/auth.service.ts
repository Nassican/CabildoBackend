import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async register(registerUserDto: RegisterUserDto) {
        const user = await this.usersService.findOneByNumDoc(registerUserDto.num_documento);
        if (user) {
            throw new BadRequestException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);

        const userDB = await this.usersService.create({
            ...registerUserDto,
            password: hashedPassword
        })

        delete userDB.password;
        delete userDB.huella_digital;

        return userDB;
    }

    async login(loginUserDto: LoginUserDto) {
        const user = await this.usersService.findOneByNumDoc(loginUserDto.num_documento);
        
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { num_documento: user.num_documento, role: user.role};
        const token = await this.jwtService.signAsync(payload);

        user.password = undefined;
        user.huella_digital = undefined;

        return {
            ...user,
            token
        };

    }


    // Logout function to delete the token from the user
    async removeToken(token: string) {
        
    }

    async profile({ num_documento, role}: { num_documento: string, role: string}) {

        // if (role !== 'admin') {
        //     throw new UnauthorizedException(
        //         'You do not have permission to perform this action'
        //     );
        // }

        const userDB = await this.usersService.findOneByNumDoc(num_documento);

        userDB.password = undefined;
        userDB.huella_digital = undefined;

        return userDB;
    }

}
