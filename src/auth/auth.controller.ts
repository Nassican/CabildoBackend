import { Body, Controller,  Get,  Post, Req, Res, UseGuards, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto, ValidateRegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto, ValidateLoginUserDto } from './dto/login-user.dto';
import { RequestWithUser } from './interface/auth.interface';
import { Auth } from './decorators/auth.decorator';
import { Recursos } from './enums/resource.enum';
import { AuthGuard } from './guard/auth.guard';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly AuthService: AuthService
    ) {}

    @Post('register')
    register(@Body() registerUserDto: RegisterUserDto) {
        const validation = ValidateRegisterUserDto(registerUserDto);
        if (!validation.success) {
            throw new Error(validation.error.message);
        }

        return this.AuthService.register(registerUserDto);
    }

    @Post('login')
    login(
        @Body() loginUserDto: LoginUserDto
    ){
        const validation = ValidateLoginUserDto(loginUserDto);
        if (!validation.success) {
            throw new Error(validation.error.message);
        }
        return this.AuthService.login(loginUserDto);
    }

    // @Post('logout')
    // @Auth(Role.ADMIN, Role.USER)
    // async logout(@Req() req: RequestWithUser) {
    //     const vacio = '';
    //     req.headers.authorization = vacio;
    //     console.log(req.headers.authorization);

    //     return 'Salida Exitosa';
    // }

    @Get('profile')
    // @Resource('profile')
    @Auth(Recursos.list_user)
    profile(
        @Req() req: RequestWithUser
    ) {
        console.log(req.user);
        return this.AuthService.profile(req.user);
    }

}
