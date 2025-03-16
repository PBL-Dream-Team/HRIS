import { IsNotEmpty } from "class-validator";

export class CreateLetterFormatDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    content: string;
}
