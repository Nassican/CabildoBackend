import { Transform } from "class-transformer";
import { IsString, MaxLength } from "class-validator";
import z from "zod";

// make a class validator using zod
const zRegisterUserDto = z.object({
    num_documento: z.string().max(10),
    nombres: z.string(),
    apellidos: z.string(),
    password: z.string(),
});

export class RegisterUserDto {
    @Transform(({ value }) => value.trim())
    @IsString()
    @MaxLength(10)
    num_documento: string;

    @IsString()
    nombres: string;

    @IsString()
    apellidos: string;

    @Transform(({value}) => value.trim())
    @IsString()
    password: string;
}

export const ValidateRegisterUserDto = (data: RegisterUserDto) => {
    const result = zRegisterUserDto.safeParse(data);
    return result;
}