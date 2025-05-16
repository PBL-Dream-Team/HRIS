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
    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'must be in HH:mm:ss format',
    })
    @IsOptional()
    check_in: string;

    @ApiPropertyOptional()
    @IsEnum(checkinstatus)
    @IsOptional()
    check_in_status: checkinstatus;

    @ApiPropertyOptional()
    @IsLatitude()
    @IsOptional()
    check_in_lat: number;
    
    @ApiPropertyOptional()
    @IsLongitude()
    @IsOptional()
    check_in_long: number;
    
    @ApiPropertyOptional()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'must be in HH:mm:ss format',
    })
    @IsOptional()
    check_out: string;

    @IsEnum(checkoutstatus)
    @IsOptional()
    check_out_status: checkoutstatus;

    @IsLatitude()
    @IsOptional()
    check_out_lat: number;
    
    @IsLongitude()
    @IsOptional()
    check_out_long: number;

    @IsString()
    @IsOptional()
    workpict_dir: string;
}