import { IsDate, IsLatitude, IsLongitude, IsNotEmpty, IsString, IsUUID, Matches } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class createAttendanceTypeDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    company_id:string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({example:"1970-01-01T08:57:24.123Z"})
    @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, {
         message: 'Timestamp must be in ISO 8601 format',
    })
    @IsNotEmpty()
    check_in: Date;

    @ApiProperty({example:"1970-01-01T08:57:24.123Z"})
    @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, {
         message: 'Timestamp must be in ISO 8601 format',
    })
    @IsNotEmpty()
    check_out: Date;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    workspace_address: string;

    @ApiProperty()
    @IsLatitude()
    @IsNotEmpty()
    workspace_lat: number;
    
    @ApiProperty()
    @IsLongitude()
    @IsNotEmpty()
    workspace_long: number;
    
}