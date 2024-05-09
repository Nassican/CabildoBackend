import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperadminService } from './superadmin.service';
import { SuperadminController } from './superadmin.controller';
import { SuperAdmin } from './entities/superadmin.entity';
import { UsersModule } from 'src/users/users.module';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([SuperAdmin]),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => UsersModule),
    JwtModule,
  ],
  controllers: [SuperadminController],
  providers: [SuperadminService],
  exports: [SuperadminService]
})
export class SuperadminModule {}
