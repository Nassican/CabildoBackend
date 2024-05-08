import { Injectable } from '@nestjs/common';
import { CreateSuperadminDto } from './dto/create-superadmin.dto';
import { UpdateSuperadminDto } from './dto/update-superadmin.dto';

@Injectable()
export class SuperadminService {
  create(createSuperadminDto: CreateSuperadminDto) {
    return 'This action adds a new superadmin';
  }

  findAll() {
    return `This action returns all superadmin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} superadmin`;
  }

  update(id: number, updateSuperadminDto: UpdateSuperadminDto) {
    return `This action updates a #${id} superadmin`;
  }

  remove(id: number) {
    return `This action removes a #${id} superadmin`;
  }
}
