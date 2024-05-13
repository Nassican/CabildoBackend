import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { boolean } from 'zod';

@Injectable()
export class UsersService {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly rolesService: RolesService

  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const {rolesIds, ...dataInsert} = createUserDto;

    //console.log('RolesIds', rolesIds);

    const rolesUser = await this.rolesService.findByIds(rolesIds);

    if (!rolesUser || rolesUser.length === 0) {
      throw new BadRequestException('Roles no encontrados');
    }

    //console.log('RolesUser', rolesUser);

    let userToSave = this.userRepository.create({
      ...dataInsert,
      roles: rolesUser,
    });

    console.log('User', userToSave);
  
    return this.userRepository.save(userToSave);
  }

  async updateUser(updateUserDto: UpdateUserDto) {
    const { num_documento, rolesIds, ...dataUpdate } = updateUserDto;
    
    //console.log('DataUpdate', dataUpdate);


    const user = await this.userRepository.findOne(
      { where: { num_documento: num_documento }, relations: ['roles'] }
    );

    //console.log('User', user);

    if (!user) {
      throw new BadRequestException(`Usuario con número de documento ${num_documento} no encontrado`);
    }

    // Verificar que haya un cuerpo
    if (!dataUpdate.nombres && !dataUpdate.apellidos && !rolesIds) {
      throw new BadRequestException('No hay datos para actualizar');
    }

    let hayCambios: boolean = true;

    if (dataUpdate.nombres === (user.nombres || '')) {
      console.log("UPDATE " + dataUpdate.nombres + " ANTERIOR " + user.nombres)
      console.log('Nombres iguales');
      hayCambios = false;
    }
    if (dataUpdate.apellidos === (user.apellidos || '')) {
      console.log('Apellidos iguales');
      hayCambios = false;
    }
    // Obtener los IDs de los roles actuales y nuevos
    const userRolesIds = new Set(user.roles.map(role => role.id));
    const newRolesIds = new Set(rolesIds || []);

    // Verificar si los nuevos roles están incluidos en los roles actuales
    const rolesAdded = [...newRolesIds].some(roleId => !userRolesIds.has(roleId));
    const rolesRemoved = [...userRolesIds].some(roleId => !newRolesIds.has(roleId));

    if (rolesAdded || rolesRemoved) {
      console.log('Roles cambiados');
      hayCambios = true;
    } else {
      console.log('ROLES: Roles iguales');
      hayCambios = false;
    }

    if (!hayCambios) {
      throw new BadRequestException('No hay datos para actualizar');
    }

    
    //console.log('RolesIds ', rolesIds);
    if (rolesIds) {
      const rolesUser = await this.rolesService.findByIds(rolesIds);
      if (!rolesUser || rolesUser.length === 0) {
        throw new BadRequestException('Roles no encontrados');
      }
      user.roles = rolesUser;
    }

    user.nombres = dataUpdate.nombres ?? user.nombres;
    user.apellidos = dataUpdate.apellidos ?? user.apellidos;

    console.log('Apunto de guardar')
    //guardar cambios del usuario
    return this.userRepository.save(user)
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id_usuario: id },
      relations: ['roles']
    });

    if (!user) {
      //throw new BadRequestException(`Usuario con ID ${id} no encontrado`);
      return null
    }

    return user;
  }

  async findOneByNumDoc(num_documento: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { num_documento: num_documento },
      relations: ['roles']
    });

    if (!user) {
      //throw new BadRequestException(`Usuario con número de documento ${num_documento} no encontrado`);
      return null
    }

    return user
  }

  async findOneByIdWithPassword(num_documento: string): Promise<User> {
    const user = this.userRepository.findOne({
      where: { num_documento: num_documento},
      select: ['id_usuario', 'num_documento', 'nombres', 'apellidos','password']
    });

    if (!user) {
      throw new BadRequestException(`Usuario con número de documento ${num_documento} no encontrado`);
    }

    return user;

  }

  // TODO: Quitar luego
  async findAll() {
    const user = await this.userRepository.find();
    const userRoles = await Promise.all(
      user.map(user => this.getUserRoles(user.id_usuario))
    );

    const userDB = user.map((user, index) => {
      return {
        ...user,
        roles: userRoles[index]
      }
    });

    //console.log('UserDB', userDB);
    return userDB;
  }
  
  
  async getUserRoles(userId: number): Promise<string[]> {
    const user = await this.userRepository.findOne({
      where: { id_usuario: userId },
      relations: ['roles'],
    
    });
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const roles = user.roles.map(role => role.name);

    return roles;
  }

}

// Función auxiliar para comparar arrays
function arraysEqual(a: any[], b: any[]) {
  return (
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}