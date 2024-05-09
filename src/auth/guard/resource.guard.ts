import { Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reflector } from '@nestjs/core';
import { Repository } from 'typeorm';
import * as _ from 'underscore'
import { User } from '../../users/entities/user.entity';
import { SuperadminService } from '../../superadmin/superadmin.service';


@Injectable()
export class ResourceGuard implements CanActivate {
  
  constructor(
    private readonly SuperadminService: SuperadminService,
    private readonly reflector: Reflector,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>{

    try {
      const resource = this.reflector.get('resource', context.getHandler());
      //console.log('Resource', resource);

      const req = context.switchToHttp().getRequest();
      //console.log('Request', req.user.num_documento);

      try {
        //console.log('Antes de isSuperadmin');
        const isSuperadmin = await this.SuperadminService.isSuperadmin(req.user.num_documento);
        //Si el usuario es el superadmin, permitir acceso a todos los recursos
        if (isSuperadmin) {
          //console.log('Superadmin Entrando a recurso');
          return true;
        }
      } catch (error) {
        console.log('Ln 44 Error:', error);
      }
      

      if (resource) {
        return this.userRepo.findOne({
          where: { num_documento: req.user.num_documento },
          relations: ['roles', 'roles.roleRecursos', 'roles.roleRecursos.recurso'],
        }).then(user => {
          if (!(user instanceof User)) {
            return false;
          }
    
          let recursos = user.roles.flatMap(role => {
            return role.roleRecursos.map(roleRecurso => roleRecurso.recurso.nombre_recurso);
          });
    
          console.log('ResourceGuard. Recursos del usuario', recursos);
          return recursos.includes(resource);
        }).catch(err => {
          console.log('Failed to find user', err);
          return false;
        });
      }

      return true;

    } catch (error) {
      console.log('Error', error);
      return false;
    }


    
  }
}
