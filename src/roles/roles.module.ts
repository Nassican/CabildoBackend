import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { User } from '../users/entities/user.entity';
import { RoleRecurso } from './entities/roles-recurso.entity';
import { Recurso } from '../resources/entities/resource.entity';
import { JwtModule } from '@nestjs/jwt';
import { SuperadminModule } from 'src/superadmin/superadmin.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Role, RoleRecurso]),
    TypeOrmModule.forFeature([Recurso]),
    JwtModule,
    SuperadminModule,
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
