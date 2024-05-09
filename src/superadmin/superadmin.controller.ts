import { Controller, Get, Param, Put, UseGuards} from '@nestjs/common';
import { SuperadminService } from './superadmin.service';
import { SoloSuperadminGuard } from './guard/solo-superadmin.guard';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { SoloSuperAdmin } from './decorators/superadmin.decorator';

@Controller('superadmin')
export class SuperadminController {
  constructor(private readonly superadminService: SuperadminService) {}

  @SoloSuperAdmin()
  @Put('assign/:userId')
  async assignSuperadminRole(@Param('userId') userId: number) {
    return this.superadminService.assignSuperadminRole(userId);
  }

  @SoloSuperAdmin()
  @Put('remove/:userId')
  async removeSuperadminRole(@Param('userId') userId: number) {
    return this.superadminService.removeSuperadminRole(userId);
  }

  @SoloSuperAdmin()
  @Get()
  async findAll() {
    return this.superadminService.findAll();
  }
}
