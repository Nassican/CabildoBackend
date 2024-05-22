import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto, ValidateCreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto, ValidateUpdateRoleDto } from './dto/update-role.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  AsignarRecursoARolDto,
  ValidateAsignarRecursoARolDto,
} from './dto/asign-resource-to-rol.dto';

@ApiTags('Roles')
@ApiBearerAuth()
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

  // @Post('assignres')
  // //@Auth(Recursos.ASSIGN_RESOURCE)
  // assignResourceToRole(@Body() asignarRecursoDto: AsignarRecursoARolDto) {
  //   const validation = ValidateAsignarRecursoARolDto(asignarRecursoDto);
  //   if (!validation.success) {
  //     throw new Error(validation.error.message);
  //   }
  //   return this.rolesService.asignarRecursosARol(asignarRecursoDto);
  // }

  @Post('assignres')
  updateResourceToRole(@Body() asignarRecursoDto: AsignarRecursoARolDto) {
    const validation = ValidateAsignarRecursoARolDto(asignarRecursoDto);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }
    return this.rolesService.actualizarRecursosARol(asignarRecursoDto);
  }

  @Get('resources')
  findAllResources() {
    return this.rolesService.findAllResourcesRoles();
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Get('name/:name')
  findOneByName(@Param('name') name: string) {
    return this.rolesService.findOneByNameRole(name);
  }

  @Patch()
  async update(@Body() updateRoleDto: UpdateRoleDto) {
    const validation = ValidateUpdateRoleDto(updateRoleDto);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    return this.rolesService.update(updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
