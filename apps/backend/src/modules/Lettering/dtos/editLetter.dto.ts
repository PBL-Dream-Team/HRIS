import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, IsUUID, Matches } from "@nestjs/class-validator";
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

    @ApiPropertyOptional({example:"1970-01-01T08:57:24.123Z or 1970-01-01T08:57:24.123+07:00. Z for UTC +0 Zulu and +7 for Indonesia"})
    @Matches(
             /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|[+-]\d{2}:\d{2})$/,
             {
               message: 'Timestamp must be in ISO 8601 format (with Z or timezone offset)',
             })
    @IsNotEmpty()
    valid_until;
    
    @ApiPropertyOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsOptional()
    is_active: boolean;
}