import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RolesModule } from '../roles/roles.module';
import { JwtModule } from '@nestjs/jwt';

// importar UserRepository
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RolesModule,
    JwtModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}