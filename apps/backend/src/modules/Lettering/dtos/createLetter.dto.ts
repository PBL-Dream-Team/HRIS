import { IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from "@nestjs/class-validator";

export class createLetterDto {
    @IsUUID()
    @IsNotEmpty()
    company_id:string;

    @IsUUID()
    @IsNotEmpty()
    employee_id:string;

    @IsUUID()
    @IsNotEmpty()
    lettertype_id:string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    desc: string;

    @IsUUID()
    @IsOptional()
    file_dir:string;

    @IsDate()
    @IsNotEmpty()
    valid_until: Date;
}