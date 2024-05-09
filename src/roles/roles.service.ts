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

    const nuevosRecursos = await this.recursoRepository.find({
      where: { id: In(nuevosRecursosIds) },
    });

    const nuevosRoleRecursos = nuevosRecursos.map(recurso => {
      const roleRecurso = this.roleRecursoRepository.create({
        role: rol,
        recurso: recurso,
      });
      return roleRecurso;
    });

    if (nuevosRoleRecursos.length === 0) {
      throw new BadRequestException('Todos los recursos ya están asignados al rol');
    }

    const roleRecursosSaved = await this.roleRecursoRepository.save(nuevosRoleRecursos);

    return roleRecursosSaved;
  }
  
  async findOneByNameRole(name: string): Promise<Role> {
    console.log('Name', name);
    const options: FindOneOptions<Role> = {
      where: { name }, // Otras opciones de búsqueda pueden ser agregadas aquí si es necesario
    };
    
    const role = await this.roleRepository.findOne(options);
    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }
    return role;
  }
  
  async findAll() {
    return this.roleRepository.find({});
  }

  async findAllResourcesRoles() {
    return this.roleRecursoRepository.find({ relations: ['role', 'recurso'] });
  }

  async findOne(id: number): Promise<Role | undefined> {
    if (!id) {
      throw new NotFoundException('ID no proporcionado');
    }
    
    const options: FindOneOptions<Role> = {
      where: { id }, // Otras opciones de búsqueda pueden ser agregadas aquí si es necesario
    };

    const role = await this.roleRepository.findOne(options);
    
    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }
    return role;
  }
  
  async update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  async remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
