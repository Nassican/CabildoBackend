import { IsArray, IsNumber, IsString } from 'class-validator';
import z from 'zod';

// make a class validator using zod
const zCreateRoleDto = z.object({
  name: z.string(),
  recursosIds: z.array(z.number()),
});

export class CreateRoleDto {
  @IsString()
  name: string;
}

export class CreateRoleDtoResource {
  @IsString()
  name: string;

  @IsArray()
  @IsNumber({}, { each: true })
  recursosIds: number[];
}

export const ValidateCreateRoleDto = (data: CreateRoleDtoResource) => {
  const result = zCreateRoleDto.safeParse(data);
  return result;
};
