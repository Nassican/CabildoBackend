import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto, ValidateCreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto, ValidateUpdateResourceDto } from './dto/update-resource.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Resources')
@ApiBearerAuth()
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  create(@Body() createResourceDto: CreateResourceDto) {  
    const validation = ValidateCreateResourceDto(createResourceDto);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }
    return this.resourcesService.createRecurso(createResourceDto);
  }

  @Get()
  findAll() {
    return this.resourcesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resourcesService.findOne(+id);
  }

  @Patch()
  update(@Body() updateResourceDto: UpdateResourceDto){
    const validation = ValidateUpdateResourceDto(updateResourceDto);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    return this.resourcesService.update(updateResourceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resourcesService.remove(+id);
  }
}
