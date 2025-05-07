import { IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from "@nestjs/class-validator";

export class editLetterDto {
    @IsUUID()
    @IsOptional()
    company_id:string;

    @IsUUID()
    @IsOptional()
    employee_id:string;

    @IsUUID()
    @IsOptional()
    lettertype_id:string;

    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    desc: string;

    @IsUUID()
    @IsOptional()
    file_dir:string;

    @IsDate()
    @IsOptional()
    valid_until: Date;
}