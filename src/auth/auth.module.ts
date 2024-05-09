import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SuperadminModule } from '../superadmin/superadmin.module';
import { SuperAdmin } from '../superadmin/entities/superadmin.entity';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([SuperAdmin]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "1d" },
        global: true,
      }),
      
      inject: [ConfigService],
    }),
    UsersModule,
    SuperadminModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule],
})

export class AuthModule {}
