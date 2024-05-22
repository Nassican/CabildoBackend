import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { z } from 'zod';

const zUpdateResourceDto = z.object({
  id: z.number(),
  nombre_recurso: z.string().min(1).max(255).trim().optional(),
});

export class UpdateResourceDto {
  @IsNumber()
  id: number;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  nombre_recurso: string;
}

// make a class validator using zod

export const ValidateUpdateResourceDto = (data: UpdateResourceDto) => {
  const result = zUpdateResourceDto.safeParse(data);
  return result;
};
