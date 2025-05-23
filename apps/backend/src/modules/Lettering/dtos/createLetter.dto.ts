import { IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from "@nestjs/class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class createLetterDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    company_id:string;

    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    employee_id:string;

    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    lettertype_id:string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    desc: string;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    file_dir:string;

    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
    valid_until: Date;
}