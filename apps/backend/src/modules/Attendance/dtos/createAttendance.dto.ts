import { IsEnum, IsLatitude, IsLongitude, IsNotEmpty, IsOptional, IsString, IsUUID, Matches } from "@nestjs/class-validator";
import { checkinstatus } from "./checkinstatus.enum";
import { checkoutstatus } from "./checkoutstatus.enum";

export class createAttendanceDto {
    @IsUUID()
    @IsNotEmpty()
    company_id:string;

    @IsUUID()
    @IsNotEmpty()
    employee_id:string;

    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'must be in HH:mm:ss format',
    })
    @IsNotEmpty()
    check_in: string;

    @IsEnum(checkinstatus)
    @IsNotEmpty()
    check_in_status: checkinstatus;

    @IsLatitude()
    @IsNotEmpty()
    check_in_lat: number;
    
    @IsLongitude()
    @IsNotEmpty()
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
    @IsNotEmpty()
    workpict_dir: string;
}