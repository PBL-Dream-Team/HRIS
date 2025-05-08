import { IsNotEmpty, IsOptional, IsString, IsUUID } from "@nestjs/class-validator";

export class createLetterTypeDto {
    @IsString()
    @IsNotEmpty()
    name:string;

    @IsString()
    @IsOptional()
    content:string;

    @IsUUID()
    @IsNotEmpty()
    company_id:string;
}