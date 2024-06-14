import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';

import { CreateRoleDto, CreateRoleDtoResource } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleRecurso } from './entities/roles-recurso.entity';
import { Recurso } from 'src/resources/entities/resource.entity';
import { AsignarRecursoARolDto } from './dto/asign-resource-to-rol.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(RoleRecurso)
    private readonly roleRecursoRepository: Repository<RoleRecurso>,

    @InjectRepository(Recurso)
    private readonly recursoRepository: Repository<Recurso>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto);

    role.name = role.name.toLowerCase();

    const roleExists = await this.roleRepository.findOne({
      where: { name: role.name },
    });

    if (roleExists) {
      throw new BadRequestException('Rol ya existe');
    }

    return this.roleRepository.save(role);
  }

  async createRoleWithResources(createRoleDto: CreateRoleDtoResource) {
    const role = this.roleRepository.create(createRoleDto);

    console.log('Role', role);
    console.log('Recursos', createRoleDto.recursosIds);

    role.name = role.name.toLowerCase();

    const roleExists = await this.roleRepository.findOne({
      where: { name: role.name },
    });

    if (roleExists) {
      throw new BadRequestException('Rol ya existe');
    }

    const roleSaved = await this.roleRepository.save(role);

    if (createRoleDto.recursosIds.length > 0) {
      const recursos = await this.recursoRepository.find({
        where: { id: In(createRoleDto.recursosIds) },
      });
      const roleRecursos = recursos.map((recurso) => {
        return this.roleRecursoRepository.create({
          role: roleSaved,
          recurso: recurso,
        });
      });

      await this.roleRecursoRepository.save(roleRecursos);
    }

    return roleSaved;
  }

  async setRoleDefault() {
    const defaultRole = await this.roleRepository.findOne({
      where: { name: 'default' },
    });
    if (!defaultRole) {
      throw new NotFoundException('Default role not found');
    }

    return defaultRole;
  }

  async findByIds(rolesIds: number[]): Promise<Role[]> {
    const roles = this.roleRepository.find({ where: { id: In(rolesIds) } });
    if (!roles) {
      throw new NotFoundException('Roles no encontrados');
    }
    return roles;
  }

  async asignarRecursosARol(asignarRecursoDto: AsignarRecursoARolDto): Promise<RoleRecurso[]> {
    const { rolId, recursosIds } = asignarRecursoDto;
    const rol = await this.roleRepository.findOne({
      where: { id: rolId },
      relations: ['roleRecursos', 'roleRecursos.recurso'],
    });
    console.log('Rol', rol);

    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }

    // Obtener los IDs de los recursos ya asignados al rol
    const recursosAsignadosIds = rol.roleRecursos.map((rr) => rr.recurso.id);

    // Filtrar los nuevos recursos que no están asignados al rol
    const nuevosRecursosIds = recursosIds.filter((id) => !recursosAsignadosIds.includes(id));

    // Obtener los objetos de los nuevos recursos a asignar
    const nuevosRecursos = await this.recursoRepository.find({
      where: { id: In(nuevosRecursosIds) },
    });

    // Crear los nuevos objetos RoleRecurso
    const nuevosRoleRecursos = nuevosRecursos.map((recurso) => {
      const roleRecurso = this.roleRecursoRepository.create({
        role: rol,
        recurso: recurso,
      });
      return roleRecurso;
    });

    // Guardar los nuevos objetos RoleRecurso
    const roleRecursosSaved = await this.roleRecursoRepository.save(nuevosRoleRecursos);

    // Devolver todos los RoleRecurso asignados al rol, incluyendo los nuevos
    return [...rol.roleRecursos, ...roleRecursosSaved];
  }

  // Con esta funcion se actualizan los recursos y nombre de un rol
  async actualizarRecursosARol(asignarRecursoDto: AsignarRecursoARolDto): Promise<RoleRecurso[]> {
    // Body de la petición
    // { rolId: number, name: string, recursosIds: number[]}
    // rolId es obligatorio
    // name es opcional
    // recursosIds es obligatorio aunque sea un arreglo vacio

    // Modificar esta funcion para actualizar los roles
    const { rolId, name, recursosIds } = asignarRecursoDto;
    const rol = await this.roleRepository.findOne({
      where: { id: rolId },
      relations: ['roleRecursos', 'roleRecursos.recurso'],
    });

    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }

    // Obtener los IDs de los recursos ya asignados al rol
    const recursosAsignadosIds = rol.roleRecursos.map((rr) => rr.recurso.id);

    // Recursos a eliminar
    const recursosAEliminar = rol.roleRecursos.filter((rr) => !recursosIds.includes(rr.recurso.id));

    // Recursos nuevos a asignar
    const nuevosRecursosIds = recursosIds.filter((id) => !recursosAsignadosIds.includes(id));
    const nuevosRecursos = await this.recursoRepository.find({
      where: { id: In(nuevosRecursosIds) },
    });

    // Actualizar nombre en caso de que el nombre sea diferente al que ya tiene
    if (name && name !== rol.name) {
      rol.name = name;
      await this.roleRepository.save(rol);
    }

    const nuevosRoleRecursos = nuevosRecursos.map((recurso) => {
      const roleRecurso = this.roleRecursoRepository.create({
        role: rol,
        recurso: recurso,
      });
      return roleRecurso;
    });

    // Eliminar recursos
    await this.roleRecursoRepository.remove(recursosAEliminar);

    // Guardar nuevos recursos
    await this.roleRecursoRepository.save(nuevosRoleRecursos);

    const recursosRoles = await this.roleRecursoRepository.find({
      where: { role: rol },
      relations: ['recurso'],
    });

    // return [...rol.roleRecursos, ...roleRecursosSaved];
    return [...recursosRoles];
  }

  async findOneByNameRole(name: string): Promise<any> {
    //console.log('Name', name);

    const rol = await this.roleRepository.findOne({
      where: { name: name },
      relations: ['roleRecursos', 'roleRecursos.recurso'],
    });

    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }

    const recursos = await this.roleRecursoRepository.find({
      where: { role: rol },
      relations: ['recurso'],
    });

    return {
      ...rol,
      roleRecursos: recursos.map((rr) => rr.recurso),
    };
  }

  async findAll() {
    return this.roleRepository.find({});
  }

  async findAllResourcesRoles() {
    const rolesRecursos = await this.roleRecursoRepository.find({
      relations: ['role', 'recurso'],
    });

    if (!rolesRecursos) {
      throw new NotFoundException('Roles no encontrados');
    }

    // console.log('RolesRecursos', rolesRecursos);

    // Conseguir todos los roles y recursos incluyendo los roles que no tienen recursos
    const roles = await this.roleRepository.find({ relations: ['roleRecursos'] });
    //console.log('Roles', roles);
    // Mapear los roles y recursos
    const rolesRecursosMaped = roles.map((role) => {
      return {
        id: role.id,
        name: role.name,
        recursos: rolesRecursos
          .filter((rr) => rr.role.id === role.id)
          .map((rr) => {
            return {
              id: rr.recurso.id,
              name: rr.recurso.nombre_recurso,
            };
          }),
      };
    });

    //console.log('RolesMap', rolesRecursosMaped);

    //console.log('RolesMap', rolesRecursos);

    // console.log('RolesMap', rolesRecursosMaped);

    return rolesRecursosMaped;
  }

  async findOne(id: number): Promise<any> {
    if (!id) {
      throw new NotFoundException('ID no proporcionado');
    }

    const rol = await this.roleRepository.findOne({ where: { id: id } });

    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }

    const recursos = await this.roleRecursoRepository.find({
      where: { role: rol },
      relations: ['recurso'],
    });

    return {
      ...rol,
      roleRecursos: recursos.map((rr) => rr.recurso),
    };
  }

  async update(updateRoleDto: UpdateRoleDto) {
    const { id, ...dataUpdate } = updateRoleDto;

    const recurso = await this.roleRepository.findOne({ where: { id: id } });

    if (!dataUpdate.name) {
      throw new BadRequestException('Nombre de rol no puede ser vacio');
    }

    if (!recurso) {
      throw new BadRequestException('Rol no encontrado');
    }

    if (dataUpdate.name) {
      dataUpdate.name = dataUpdate.name.toLowerCase().trim();

      const roleExists = await this.roleRepository.findOne({
        where: { name: dataUpdate.name },
      });

      if (roleExists) {
        throw new BadRequestException('Rol ya existe');
      }
    }

    if (dataUpdate.name === '') {
      throw new BadRequestException('Nombre de rol no puede ser vacio');
    }

    return this.roleRepository.update(id, dataUpdate);
  }

  async remove(id: number) {
    // Eliminar el rol
    const role = await this.roleRepository.findOne({
      where: { id },
    });
    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    try {
      this.roleRepository.remove(role);
      // Enviar mensaje de exito
      return { message: 'Rol eliminado' };
    } catch (error) {
      throw new BadRequestException('Error al eliminar el rol');
    }
  }

  async findManyByIds(ids: number[]): Promise<Role[]> {
    const roles = await this.roleRepository.findByIds(ids);
    if (roles.length !== ids.length) {
      const missingIds = ids.filter((id) => !roles.some((role) => role.id === id));
      throw new NotFoundException(`Uno o más roles no encontrados: ${missingIds.join(', ')}`);
    }
    return roles;
  }

  async removeMany(ids: number[]) {
    if (!ids.every(Number.isInteger)) {
      throw new BadRequestException('Invalid Id format. IDs must be integers.');
    }

    const roles = await this.roleRepository.find({
      where: { id: In(ids) },
    });

    if (roles.length !== ids.length) {
      throw new NotFoundException('Uno o más roles no encontrados');
    }

    // Asegurarse de que los roles no estén asignados a usuarios, buscar la id de los roles asignados a usuarios
    const rolesAssigned = await this.userRepository.find({
      where: roles.map((role) => {
        return { roles: { id: role.id } };
      }),
    });

    if (rolesAssigned.length > 0) {
      throw new BadRequestException('Uno o más roles están asignados a usuarios');
    }

    try {
      // Quitar recursos asignados al rol actualizando los recursos []
      await Promise.all(
        roles.map((role) => this.actualizarRecursosARol({ rolId: role.id, name: role.name, recursosIds: [] })),
      );
      await this.roleRepository.remove(roles);
      return { message: 'Roles eliminados' };
    } catch (error) {
      throw new BadRequestException('Error al eliminar los roles');
    }
  }
}
