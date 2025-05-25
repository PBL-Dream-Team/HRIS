import { IsEnum, IsLatitude, IsLongitude, IsNotEmpty, IsOptional, IsString, IsUUID, Matches } from "@nestjs/class-validator";
import { checkinstatus } from "./checkinstatus.enum";
import { checkoutstatus } from "./checkoutstatus.enum";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class editAttendanceDto {
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
    type_id:string;

    @ApiPropertyOptional({example:"1970-01-01T08:57:24.123Z"})
    @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, {
        message: 'Timestamp must be in ISO 8601 format',
    })
    @IsNotEmpty()
    check_in: Date;

    // @ApiPropertyOptional()
    // @IsEnum(checkinstatus)
    // @IsOptional()
    // check_in_status: checkinstatus;

    @ApiPropertyOptional()
    @IsLatitude()
    @IsOptional()
    check_in_lat: number;
    
    @ApiPropertyOptional()
    @IsLongitude()
    @IsOptional()
    check_in_long: number;
    
    @ApiPropertyOptional({example:"1970-01-01T08:57:24.123Z"})
    @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, {
        message: 'Timestamp must be in ISO 8601 format',
    })
    @IsNotEmpty()
    check_out: string;

    // @IsEnum(checkoutstatus)
    // @IsOptional()
    // check_out_status: checkoutstatus;

    @IsLatitude()
    @IsOptional()
    check_out_lat: number;
    
    @IsLongitude()
    @IsOptional()
    check_out_long: number;
}