import { IsString, MaxLength, MinLength } from "class-validator";
import { z } from "zod";

const zCreateResourceDto = z.object({
    nombre_recurso: z.string().min(1).max(255),
});

export class CreateResourceDto {
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    nombre_recurso: string;
}

// make a class validator using zod

export const ValidateCreateResourceDto = (data: CreateResourceDto) => {
    const result = zCreateResourceDto.safeParse(data);
    return result;
}
