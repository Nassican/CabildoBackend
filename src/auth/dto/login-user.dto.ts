import { Transform } from "class-transformer";
import { IsString } from "class-validator";
import z from "zod";

// make a class validator using zod
const zLoginUserDto = z.object({
    num_documento: z.string().max(10),
    password: z.string().trim(),
});

export class LoginUserDto {
    @IsString()
    num_documento: string;

    @IsString()
    password: string;
}

export const ValidateLoginUserDto = (data: LoginUserDto) => {
    const result = zLoginUserDto.safeParse(data);
    return result;
}