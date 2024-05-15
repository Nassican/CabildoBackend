import { IsNumber, IsOptional, IsString } from "class-validator";
import z from "zod";

// make a class validator using zod
const zUpdateRoleDto = z.object({
    id: z.number(),
    name: z.string().trim().optional(),
});

export class UpdateRoleDto {
    @IsNumber()
    id: number;
    @IsString()
    @IsOptional()
    name: string;
}

export const ValidateUpdateRoleDto = (data: UpdateRoleDto) => {
    const result = zUpdateRoleDto.safeParse(data);
    return result;
}