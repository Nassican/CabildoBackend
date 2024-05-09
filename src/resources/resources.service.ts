import { Injectable } from '@nestjs/common';
import { CreateResourceDto, ValidateCreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Recurso } from './entities/resource.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Recurso)
    private recursoRepository: Repository<Recurso>,
  ) {}

  async createRecurso(createResourceDto: CreateResourceDto): Promise<Recurso> {
    const nuevoRecurso = this.recursoRepository.create(createResourceDto);
    return this.recursoRepository.save(nuevoRecurso);
  }

  findAll() {
    return this.recursoRepository.find();
  }

  findOne(idRecurso: number) {
    return this.recursoRepository.findOne({where: {id: idRecurso} });
  }

  update(id: number, updateResourceDto: UpdateResourceDto) {
    return `This action updates a #${id} resource`;
  }

  remove(id: number) {
    // Remove the resource with the id provided
    return this.recursoRepository.delete(id);
  }
}
