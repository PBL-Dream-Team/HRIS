import { IsOptional, IsString, IsUUID } from "@nestjs/class-validator";

export class editLetterTypeDto {
    @IsString()
    @IsOptional()
    name:string;

    @IsString()
    @IsOptional()
    content:string;

    @IsUUID()
    @IsOptional()
    company_id:string;
}