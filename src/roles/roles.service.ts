import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { FindOneOptions, In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleRecurso } from './entities/roles-recurso.entity';
import { Recurso } from 'src/resources/entities/resource.entity';
import { AsignarRecursoARolDto } from './dto/asign-resource-to-rol.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(RoleRecurso)
    private readonly roleRecursoRepository: Repository<RoleRecurso>,

    @InjectRepository(Recurso)
    private readonly recursoRepository: Repository<Recurso>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    let role = this.roleRepository.create(createRoleDto);
    
    role.name = role.name.toLowerCase();

    const roleExists = await this.roleRepository.findOne({
      where: { name: role.name },
    });

    if (roleExists) {
      throw new BadRequestException('Rol ya existe');
    }

    return this.roleRepository.save(role);
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
    const recursosAsignadosIds = rol.roleRecursos.map(rr => rr.recurso.id);

    // Filtrar los nuevos recursos que no están asignados al rol
    const nuevosRecursosIds = recursosIds.filter(id => !recursosAsignadosIds.includes(id));

    // Obtener los objetos de los nuevos recursos a asignar
    const nuevosRecursos = await this.recursoRepository.find({
      where: { id: In(nuevosRecursosIds) },
    });

    // Crear los nuevos objetos RoleRecurso
    const nuevosRoleRecursos = nuevosRecursos.map(recurso => {
      const roleRecurso = this.roleRecursoRepository.create({ role: rol, recurso: recurso });
      return roleRecurso;
    });

    // Guardar los nuevos objetos RoleRecurso
    const roleRecursosSaved = await this.roleRecursoRepository.save(nuevosRoleRecursos);

    // Devolver todos los RoleRecurso asignados al rol, incluyendo los nuevos
    return [...rol.roleRecursos, ...roleRecursosSaved];
  }

  async actualizarRecursosARol(asignarRecursoDto: AsignarRecursoARolDto): Promise<RoleRecurso[]> {
    const { rolId, recursosIds } = asignarRecursoDto;
    const rol = await this.roleRepository.findOne({
      where: { id: rolId },
      relations: ['roleRecursos', 'roleRecursos.recurso'],
    });
  
    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }
  
    // Obtener los IDs de los recursos ya asignados al rol
    const recursosAsignadosIds = rol.roleRecursos.map(rr => rr.recurso.id);
  
    // Recursos a eliminar
    const recursosAEliminar = rol.roleRecursos.filter(rr => !recursosIds.includes(rr.recurso.id));
  
    // Recursos nuevos a asignar
    const nuevosRecursosIds = recursosIds.filter(id => !recursosAsignadosIds.includes(id));
    const nuevosRecursos = await this.recursoRepository.find({ where: { id: In(nuevosRecursosIds) } });
  
    const nuevosRoleRecursos = nuevosRecursos.map(recurso => {
      const roleRecurso = this.roleRecursoRepository.create({ role: rol, recurso: recurso });
      return roleRecurso;
    });
  
    // Eliminar recursos
    await this.roleRecursoRepository.remove(recursosAEliminar);
  
    // Guardar nuevos recursos
    const roleRecursosSaved = await this.roleRecursoRepository.save(nuevosRoleRecursos);
  
    return [...rol.roleRecursos.filter(rr => recursosIds.includes(rr.recurso.id)), ...roleRecursosSaved];
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
      roleRecursos: recursos.map(rr => rr.recurso),
    };
  }
  
  async findAll() {
    return this.roleRepository.find({});
  }

  async findAllResourcesRoles() {
    const rolesRecursos = await this.roleRecursoRepository.find({ relations: ['role', 'recurso'] });
    
    if (!rolesRecursos) {
      throw new NotFoundException('Roles no encontrados');
    }

    const groupedRolesRecursos = rolesRecursos.reduce((acc, roleRecurso) => {
      const role = roleRecurso.role;
      const recurso = roleRecurso.recurso;

      if (!acc[role.name]) {
        acc[role.name] = {
          ...role,
          recursos: [],
        };
      }
      acc[role.name].recursos.push(recurso);
      return acc;
    }, {});

    return groupedRolesRecursos;
  }

  async findOne(id: number): Promise<any>{
    if (!id) {
      throw new NotFoundException('ID no proporcionado');
    }
    
    const rol = await this.roleRepository.findOne(
      { where: { id: id } }
    );
    
    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }
    
    const recursos = await this.roleRecursoRepository.find({
      where: { role: rol },
      relations: ['recurso'],
    });


    return {
      ...rol,
      roleRecursos: recursos.map(rr => rr.recurso),
    };
  }
  
  async update(updateRoleDto: UpdateRoleDto) {

    const { id, ...dataUpdate } = updateRoleDto;

    const recurso = await this.roleRepository.findOne({where: {id: id}});

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
    
    await this.roleRepository.remove(role);

    // Enviar mensaje de exito
    return {
      message: 'Rol eliminado correctamente',
    };
    
  }
}
