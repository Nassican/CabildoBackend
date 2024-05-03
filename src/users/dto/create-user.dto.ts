import { Transform } from "class-transformer";
import { IsArray, IsString } from "class-validator";
import z from "zod";

// make a class validator using zod
const zCreateUserDto = z.object({
    num_documento: z.string(),
    nombres: z.string(),
    apellidos: z.string(),
    password: z.string(),
    roles: z.array(z.string())
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
    @Transform(({ value }) => value.trim())
    roles: string[];
}

export const ValidateCreateUserDto = (data: CreateUserDto) => {
    const result = zCreateUserDto.safeParse(data);
    return result;
}
