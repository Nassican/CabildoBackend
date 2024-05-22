import { Transform } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import z from 'zod';

// make a class validator using zod
const zUpdateUserDto = z.object({
  num_documento: z.string().trim(),
  nombres: z.string().trim().nullable().optional(),
  apellidos: z.string().trim().nullable().optional(),
  rolesIds: z.array(z.number()).optional(),
});

export class UpdateUserDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  num_documento: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @IsOptional()
  nombres?: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @IsOptional()
  apellidos?: string;

  @IsArray()
  @IsNumber({}, { each: true }) // Validar que cada elemento sea un número
  @IsOptional()
  rolesIds?: number[];
}

export const ValidateUpdateUserDto = (data: UpdateUserDto) => {
  const result = zUpdateUserDto.safeParse(data);
  return result;
};
