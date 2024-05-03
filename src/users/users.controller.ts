import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Resource } from 'src/auth/decorators/resource.decorator';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ResourceGuard } from 'src/auth/guard/resource.guard';
import 'src/common/resource.enum'
import { Recursos } from 'src/common/resource.enum';

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
  @Resource(Recursos.PROFILE)
  @UseGuards(AuthGuard, ResourceGuard)
  async findAll() {
    return this.usersService.findAll();
  }

  

}
