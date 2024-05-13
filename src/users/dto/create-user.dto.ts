import { Transform } from "class-transformer";
import { IsArray, IsNumber, IsString } from "class-validator";
import z from "zod";

// make a class validator using zod
const zCreateUserDto = z.object({
    num_documento: z.string().trim(),
    nombres: z.string().trim(),
    apellidos: z.string().trim(),
    password: z.string().trim(),
    rolesIds: z.array(z.number())
});

export class CreateUserDto {
    @IsString()
    @Transform(({ value }) => value.trim())
    num_documento: string;

    @IsString()
    @Transform(({ value }) => value.trim())
    nombres: string;

    @IsString()
    @Transform(({ value }) => value.trim())
    apellidos: string;

    @IsString()
    @Transform(({ value }) => value.trim())
    password: string;

    @IsArray()
    @IsNumber({}, { each: true }) // Validar que cada elemento sea un número
    rolesIds: number[];
}

export const ValidateCreateUserDto = (data: CreateUserDto) => {
    const result = zCreateUserDto.safeParse(data);
    return result;
}
