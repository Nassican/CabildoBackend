import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto, ValidateCreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  //@Auth(Recursos.CREATE_ROLE)
  create(@Body() createRoleDto: CreateRoleDto) {
    const validation = ValidateCreateRoleDto(createRoleDto);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Get('name/:name')
  findOneByName(@Param('name') name: string) {
    return this.rolesService.findOneByNameRole(name);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
