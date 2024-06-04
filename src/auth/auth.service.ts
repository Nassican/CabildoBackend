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
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const user = await this.usersService.findOneByNumDoc(registerUserDto.num_documento);
    if (user) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);

    const userDB = await this.usersService.create({
      ...registerUserDto,
      password: hashedPassword,
    });

    userDB.password = undefined;

    return userDB;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findOneByIdWithPassword(loginUserDto.num_documento);

    if (!user) {
      throw new UnauthorizedException('Credenciales Invalidas');
    }

    const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales Invalidas');
    }

    const payload = { num_documento: user.num_documento, role: user.roles };
    const token = await this.jwtService.signAsync(payload);

    user.password = undefined;

    console.log(user);

    return {
      ...user,
      token,
    };
  }

  // Logout function to delete the token from the user
  async removeToken() {}

  async profile({ num_documento, roles }: { num_documento: string; roles: string[] }) {
    const userDB = await this.usersService.findOneByNumDoc(num_documento);
    return userDB;
  }
}
