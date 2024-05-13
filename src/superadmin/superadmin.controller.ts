import { Controller, Delete, Get, Param, Post} from '@nestjs/common';
import { SuperadminService } from './superadmin.service';
import { SoloSuperAdmin } from './decorators/superadmin.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Superadmin')
@ApiBearerAuth()
@Controller('superadmin')
export class SuperadminController {
  constructor(private readonly superadminService: SuperadminService) {}

  @SoloSuperAdmin()
  @Post(':userId')
  async assignSuperadminRole(@Param('userId') userId: number) {
    return this.superadminService.assignSuperadminRole(userId);
  }

  @SoloSuperAdmin()
  @Delete(':userId')
  async removeSuperadminRole(@Param('userId') userId: number) {
    return this.superadminService.removeSuperadminRole(userId);
  }

  @SoloSuperAdmin()
  @Get()
  async findAll() {
    return this.superadminService.findAll();
  }
}
