import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { SoloSuperadminGuard } from '../guard/solo-superadmin.guard';

export function SoloSuperAdmin() {
  return applyDecorators(UseGuards(AuthGuard, SoloSuperadminGuard));
}
