import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import * as z from 'zod';

const zAsignarRecursoARolDto = z.object({
  rolId: z.number(),
  recursosIds: z.array(z.number()),
});

export class AsignarRecursoARolDto {
  @IsNumber()
  rolId: number;

  @IsString()
  @IsOptional()
  name: string;

  @IsArray()
  @IsNumber({}, { each: true })
  recursosIds: number[];
}

export const ValidateAsignarRecursoARolDto = (data: AsignarRecursoARolDto) => {
  const result = zAsignarRecursoARolDto.safeParse(data);
  return result;
};
