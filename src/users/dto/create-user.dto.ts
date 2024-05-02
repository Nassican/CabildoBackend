import z from "zod";

// make a class validator using zod
const zCreateUserDto = z.object({
    num_documento: z.string(),
    nombres: z.string(),
    apellidos: z.string(),
    password: z.string(),
});

export class CreateUserDto {
    num_documento: string;
    nombres: string;
    apellidos: string;
    password: string;
}

export const ValidateCreateUserDto = (data: CreateUserDto) => {
    const result = zCreateUserDto.safeParse(data);
    return result;
}
