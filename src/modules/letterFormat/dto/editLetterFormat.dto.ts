import { IsOptional } from "class-validator";

export class EditLetterFormatDto {
    @IsOptional()
    name?: string;

    @IsOptional()
    content?: string;
}
