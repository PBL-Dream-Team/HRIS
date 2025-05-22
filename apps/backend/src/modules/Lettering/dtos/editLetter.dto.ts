import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from "@nestjs/class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type, Transform } from 'class-transformer';

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