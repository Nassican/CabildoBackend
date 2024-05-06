import { Transform } from "class-transformer";
import { IsString, MaxLength } from "class-validator";
import z from "zod";

// make a class validator using zod
const zLoginUserDto = z.object({
    num_documento: z.string().max(12).trim(),
    password: z.string().trim(),
});

export class LoginUserDto {
    @IsString()
    @MaxLength(12)
    @Transform(({value}) => value.trim())
    num_documento: string;

    @IsString()
    @Transform(({value}) => value.trim())
    password: string;
}

export const ValidateLoginUserDto = (data: LoginUserDto) => {
    const result = zLoginUserDto.safeParse(data);
    return result;
}