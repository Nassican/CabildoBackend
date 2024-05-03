import { Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Repository } from 'typeorm';
import * as _ from 'underscore'
import { User } from 'src/users/entities/user.entity';


@Injectable()
export class ResourceGuard implements CanActivate {
  
  constructor(
    private readonly reflector: Reflector,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    try {
      const resource = this.reflector.get('resource', context.getHandler());
      console.log('Resource', resource);

      const req = context.switchToHttp().getRequest();
      console.log('Request', req.user);

      
      if (resource) {
        return this.userRepo.findOne({
          where: { num_documento: req.user.num_documento },
          relations: ['roles'],
        }).then(user => {
          if (!(user instanceof User)) {
            return false;
          }

          let resources = user.roles.map(role => {
            console.log('Role', role.resources);
            return JSON.parse(role.resources);
          })

          let permissions = _.unique(_.flatten(resources));
          return permissions.includes(resource);

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
