import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    num_documento?: string;
    nombres?: string;
    apellidos?: string;
    password?: string;
    roles?: number[];
}
