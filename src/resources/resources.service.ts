import { BadRequestException, Injectable } from '@nestjs/common';
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
    
    nuevoRecurso.nombre_recurso = nuevoRecurso.nombre_recurso.toLowerCase();
    
    const nuevoRecursoExists = await this.recursoRepository.findOne({
      where: { nombre_recurso: nuevoRecurso.nombre_recurso },
    });

    if (nuevoRecursoExists) {
      throw new BadRequestException('Recurso ya existe');
    }

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

  async remove(id: number) {
    // Remover el recurso usando la id, pero si la id esta usada en algun rol, no se puede remover
    
    const recurso = await this.recursoRepository.find({where: {id: id}});

    console.log('Recurso', recurso);

    if (!recurso.length) {
      throw new BadRequestException('Recurso no encontrado');
    }

    try {
      await this.recursoRepository.delete(id);
    } catch (error) {
      throw new BadRequestException('Recurso no puede ser eliminado');
    }
  }
}
