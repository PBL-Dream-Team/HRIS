import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from "@nestjs/class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type, Transform } from 'class-transformer';

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

    @ApiProperty()
    @IsDate()
    @Type(() => Date) // Converts ISO string to Date
    @IsNotEmpty()
    valid_until: Date;

    @ApiPropertyOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsOptional()
    is_active: boolean;
}