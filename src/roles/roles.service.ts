import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { Role } from './entities/role.entity';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    createRoleDto.resources = JSON.stringify(createRoleDto.resources);
    let role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  async findAll() {
    return this.roleRepository.find({});
  }

  async findOneByNameRole(name: string): Promise<Role> {
    console.log('Name', name);
    const options: FindOneOptions<Role> = {
      where: { name }, // Otras opciones de búsqueda pueden ser agregadas aquí si es necesario
    };

    return this.roleRepository.findOne(options);
  }

  async findOne(id: number): Promise<Role | undefined> {
    const options: FindOneOptions<Role> = {
      where: { id }, // Otras opciones de búsqueda pueden ser agregadas aquí si es necesario
    };
    return this.roleRepository.findOne(options);
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  async remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
