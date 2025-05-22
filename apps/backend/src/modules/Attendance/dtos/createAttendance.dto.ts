import { IsEnum, IsLatitude, IsLongitude, IsNotEmpty, IsOptional, IsString, IsUUID, Matches } from "@nestjs/class-validator";
import { checkinstatus } from "./checkinstatus.enum";
import { checkoutstatus } from "./checkoutstatus.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class createAttendanceDto {
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
    type_id:string;

    @ApiProperty()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'must be in HH:mm:ss format',
    })
    @IsNotEmpty()
    check_in: string;

    @ApiProperty()
    @IsEnum(checkinstatus)
    @IsNotEmpty()
    check_in_status: checkinstatus;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    check_in_address: string;

    @ApiProperty()
    @IsLatitude()
    @IsNotEmpty()
    check_in_lat: number;
    
    @ApiProperty()
    @IsLongitude()
    @IsNotEmpty()
    check_in_long: number;
    
    @ApiPropertyOptional()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'must be in HH:mm:ss format',
    })
    @IsOptional()
    check_out: string;

    @ApiPropertyOptional()
    @IsEnum(checkoutstatus)
    @IsOptional()
    check_out_status: checkoutstatus;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    check_out_address: string;

    @ApiPropertyOptional()
    @IsLatitude()
    @IsOptional()
    check_out_lat: number;
    
    @ApiPropertyOptional()
    @IsLongitude()
    @IsOptional()
    check_out_long: number;
}