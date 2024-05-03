import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly rolesService: RolesService

  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const {roles, ...dataInsert} = createUserDto;

    console.log('Roles', roles);

    let rolesUser = await Promise.all(
      roles.map(async (role) => {
        return this.rolesService.findOneByNameRole(role);
      })
    );

    //console.log('RolesUser before filter', rolesUser);

    rolesUser = rolesUser.filter(role => role);

    //console.log('RolesUser after filter', rolesUser);

    if (rolesUser.length === 0) {
      throw new BadRequestException('Roles not found');
    }

    let userToSave = this.userRepository.create({
      ...dataInsert,
      roles: rolesUser
    });


    return this.userRepository.save(userToSave);
  }

  async findOneByNumDoc(num_documento: string): Promise<User> {
    return this.userRepository.findOneBy({ num_documento: num_documento});
  }

  async findOneByIdWithPassword(num_documento: string): Promise<User> {
    return this.userRepository.findOne({
      where: { num_documento: num_documento},
      select: ['id_usuario', 'num_documento', 'nombres', 'apellidos','password']
    });
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
