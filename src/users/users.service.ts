import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(CreateUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(CreateUserDto);
    return this.userRepository.save(user);
  }

  async findOneByNumDoc(num_documento: string): Promise<User> {
    return this.userRepository.findOneBy({ num_documento });
  }

  // TODO: Quitar luego
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

}
