import { PartialType } from '@nestjs/swagger';
import { CreateSuperadminDto } from './create-superadmin.dto';

export class UpdateSuperadminDto extends PartialType(CreateSuperadminDto) {}
