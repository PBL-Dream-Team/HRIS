import { IsOptional, IsUUID } from "class-validator";

export class EditLetterDto {
    @IsOptional()
    @IsUUID()
    letter_format_id?: string;

    @IsOptional()
    @IsUUID()
    employee_id?: string;

    @IsOptional()
    name?: string;
}
