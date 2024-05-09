import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SuperadminService } from '../superadmin.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SoloSuperadminGuard implements CanActivate {

  constructor (
    private readonly SuperadminService: SuperadminService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ){}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    try {
      const req = context.switchToHttp().getRequest();
      console.log('Request', req.user);
      const isSuperadmin = await this.SuperadminService.isSuperadmin(req.user.num_documento);
      //Si el usuario es el superadmin, permitir acceso a todos los recursos
      if (isSuperadmin) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('Ln 25 Error:', error);
    }
  }
}
