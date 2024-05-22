import { IsArray, IsNumber } from 'class-validator';
import * as z from 'zod';

const zAsignarRecursoARolDto = z.object({
  rolId: z.number(),
  recursosIds: z.array(z.number()),
});

export class AsignarRecursoARolDto {
  @IsNumber()
  rolId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  recursosIds: number[];
}

export const ValidateAsignarRecursoARolDto = (data: AsignarRecursoARolDto) => {
  const result = zAsignarRecursoARolDto.safeParse(data);
  return result;
};
