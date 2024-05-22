import { applyDecorators, UseGuards } from '@nestjs/common';
import { Resource } from 'src/auth/decorators/resource.decorator';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ResourceGuard } from 'src/auth/guard/resource.guard';

export function AuthRes(name: string) {
  return applyDecorators(Resource(name), UseGuards(AuthGuard, ResourceGuard));
}

// TODO: BORRAR ESTE DECORADOR SI NO HAY PROBLEMAS CON EL DECORADOR AUTH
