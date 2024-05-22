import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RolesModule } from '../roles/roles.module';
import { JwtModule } from '@nestjs/jwt';
import { SuperadminService } from 'src/superadmin/superadmin.service';
import { SuperadminModule } from 'src/superadmin/superadmin.module';
import { SuperAdmin } from 'src/superadmin/entities/superadmin.entity';

// importar UserRepository
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([SuperAdmin]),
    RolesModule,
    JwtModule,
    forwardRef(() => SuperadminModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, SuperadminService],
  exports: [UsersService],
})
export class UsersModule {}
