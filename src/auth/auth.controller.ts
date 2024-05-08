import { Body, Controller,  Get,  Post, Req, Res, UseGuards, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto, ValidateRegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto, ValidateLoginUserDto } from './dto/login-user.dto';
import { RequestWithUser } from './interface/auth.interface';
import { Auth } from './decorators/auth.decorator';
import { Recursos } from '../common/enum/resource.enum';
import { AuthGuard } from './guard/auth.guard';
import { Resource } from './decorators/resource.decorator';
import { ResourceGuard } from './guard/resource.guard';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { ActiveUserInterface } from '../common/interfaces/active-user.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
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
        
    @ApiBearerAuth()
    @Get('profile')
    @Auth(Recursos.PROFILE)
    profile(@ActiveUser() user: ActiveUserInterface) {
        return this.AuthService.profile(user);
    }

}
