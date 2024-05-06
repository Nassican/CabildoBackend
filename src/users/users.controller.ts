import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Resource } from '../auth/decorators/resource.decorator';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ResourceGuard } from '../auth/guard/resource.guard';
import '../common/enum/resource.enum'
import { Recursos } from '../common/enum/resource.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { ActiveUserInterface } from 'src/common/interfaces/active-user.interface';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    return this.usersService.findOneByNumDoc(id);
  }

  @Get()
  @Auth(Recursos.USERS)
  async findAll() {
    console.log('Entro a findAll');
    return this.usersService.findAll();
  }

  

}
