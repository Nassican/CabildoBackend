import { Module } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recurso } from './entities/resource.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recurso])],
  controllers: [ResourcesController],
  providers: [ResourcesService],
})
export class ResourcesModule {}
