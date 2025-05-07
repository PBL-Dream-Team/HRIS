import { IsEnum, IsLatitude, IsLongitude, IsNotEmpty, IsOptional, IsString, IsUUID, Matches } from "@nestjs/class-validator";
import { checkinstatus } from "./checkinstatus.enum";
import { checkoutstatus } from "./checkoutstatus.enum";

export class editAttendanceDto {
    @IsUUID()
    @IsOptional()
    company_id:string;

    @IsUUID()
    @IsOptional()
    employee_id:string;

    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'must be in HH:mm:ss format',
    })
    @IsOptional()
    check_in: string;

    @IsEnum(checkinstatus)
    @IsOptional()
    check_in_status: checkinstatus;

    @IsLatitude()
    @IsOptional()
    check_in_lat: number;
    
    @IsLongitude()
    @IsOptional()
    check_in_long: number;
    
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