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

   @ApiProperty({example:"1970-01-01T08:57:24.123Z or 1970-01-01T08:57:24.123+07:00. Z for UTC +0 Zulu and +7 for Indonesia"})
           @Matches(
         /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|[+-]\d{2}:\d{2})$/,
         {
           message: 'Timestamp must be in ISO 8601 format (with Z or timezone offset)',
         })
    @IsNotEmpty()
    check_in: Date;

    @ApiProperty({example:"1970-01-01T08:57:24.123Z or 1970-01-01T08:57:24.123+07:00. Z for UTC +0 Zulu and +7 for Indonesia"})
            @Matches(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|[+-]\d{2}:\d{2})$/,
          {
            message: 'Timestamp must be in ISO 8601 format (with Z or timezone offset)',
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