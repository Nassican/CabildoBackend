import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { Resource } from '../auth/decorators/resource.decorator';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ResourceGuard } from '../auth/guard/resource.guard';
import '../common/enum/resource.enum'
import { Recursos } from '../common/enum/resource.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { ActiveUserInterface } from 'src/common/interfaces/active-user.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto, ValidateUpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Get('id/:id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: number) {
    return this.usersService.findOneById(id);
  }

  @Get('numDoc/:numDoc')
  @UseGuards(AuthGuard)
  async findOneByNumDoc(@Param('numDoc') numDoc: string) {
    return this.usersService.findOneByNumDoc(numDoc);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async findMe(@ActiveUser() user: ActiveUserInterface) {
    return this.usersService.findOneByNumDoc(user.num_documento);
  }

  // @Post()
  // @UseGuards(AuthGuard)
  // async assignRole(@Body() createUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Patch()
  @UseGuards(AuthGuard)
  async updateUser(@Body() updateUserDto: UpdateUserDto) {
    const validation = ValidateUpdateUserDto(updateUserDto);
    if (!validation.success) {
      throw new BadRequestException(validation.error.issues);
    }

    // Funcion que actualiza solo el nombre del usuario, apellido y roles
    return this.usersService.updateUser(updateUserDto);
  }

  @Get()
  @Auth(Recursos.USERS)
  async findAll() {
    console.log('Entro a findAll');
    return this.usersService.findAll();
  }

  

}
