import { IsArray, IsString } from "class-validator";
import z from "zod";

// make a class validator using zod
const zCreateRoleDto = z.object({
    name: z.string(),
    resources: z.array(z.string())
});

export class CreateRoleDto {
    @IsString()
    name: string;

    @IsArray()
    resources: string;
}

export const ValidateCreateRoleDto = (data: CreateRoleDto) => {
    const result = zCreateRoleDto.safeParse(data);
    return result;
}

