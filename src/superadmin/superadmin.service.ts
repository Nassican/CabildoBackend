import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuperAdmin } from './entities/superadmin.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class SuperadminService {

  constructor(
    // INYECTAMOS EL SERVICIO DE SUPERADMIN
    @InjectRepository(SuperAdmin)
    private superadminRepository: Repository<SuperAdmin>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async assignSuperadminRole(userId: number): Promise<SuperAdmin> {
    const user = await this.userRepository.findOne({ where: { id_usuario: userId } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    const existingSuperadmin = await this.superadminRepository.findOneBy({ id: 1 });
    if (existingSuperadmin) {
      throw new ConflictException('Ya existe un superadmin asignado');
    }

    const superadmin = new SuperAdmin();
    superadmin.user = user;
    return this.superadminRepository.save(superadmin);
  }

  async removeSuperadminRole(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id_usuario: userId } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    const superadmin = await this.superadminRepository.findOne({ where: { user } });
    if (!superadmin) {
      throw new NotFoundException('No se encontró un superadmin asignado');
    }

    await this.superadminRepository.remove(superadmin);
  }

  async isSuperadmin(numDocumento: string): Promise<boolean> {
    const superadmin = await this.superadminRepository.findOne({
      where: { user: { num_documento: numDocumento } },
      relations: ['user'],
    });
    return !!superadmin;
  }

  async findAll(): Promise<SuperAdmin[]> {
    const superadmins = await this.superadminRepository.find({
      relations: ['user'],
    });

    return superadmins;
  }
  
}
