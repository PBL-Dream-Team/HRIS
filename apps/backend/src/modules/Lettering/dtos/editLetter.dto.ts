import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from "@nestjs/class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class editLetterDto {
    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    company_id:string;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    employee_id:string;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    lettertype_id:string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    name: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    desc: string;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    file_dir:string;

    @ApiPropertyOptional()
    @IsDate()
    @IsOptional()
    valid_until: Date;

    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    is_active: boolean;
}