import { IsDate, IsEnum, IsLatitude, IsLongitude, IsNotEmpty, IsOptional, IsString, IsUUID, Matches } from "@nestjs/class-validator";
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

    @ApiProperty({example:"1970-01-01T08:57:24.123Z"})
    @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, {
         message: 'Timestamp must be in ISO 8601 format',
    })
    @IsNotEmpty()
    check_in: Date;

//     @ApiProperty()
//     @IsEnum(checkinstatus)
//     @IsNotEmpty()
//     check_in_status: checkinstatus;

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
    
    @ApiProperty({example:"1970-01-01T08:57:24.123Z"})
    @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, {
         message: 'Timestamp must be in ISO 8601 format',
    })
    @IsNotEmpty()
    check_out: Date;

//     @ApiPropertyOptional()
//     @IsEnum(checkoutstatus)
//     @IsOptional()
//     check_out_status: checkoutstatus;

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