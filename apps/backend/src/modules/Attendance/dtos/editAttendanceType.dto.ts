import { IsLatitude, IsLongitude, IsNotEmpty, IsOptional, IsString, IsUUID, Matches } from "@nestjs/class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class editAttendanceTypeDto {
    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    company_id:string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    name: string;

    @ApiPropertyOptional({example:"1970-01-01T08:57:24.123Z"})
    @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, {
        message: 'Timestamp must be in ISO 8601 format',
    })
    @IsNotEmpty()
    check_in: string;

    @ApiPropertyOptional({example:"1970-01-01T08:57:24.123Z"})
    @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, {
        message: 'Timestamp must be in ISO 8601 format',
    })
    @IsNotEmpty()
    check_out: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    workplace_address: string;

    @ApiPropertyOptional()
    @IsLatitude()
    @IsOptional()
    workplace_lat: number;
    
    @ApiPropertyOptional()
    @IsLongitude()
    @IsOptional()
    workplace_long: number;
}