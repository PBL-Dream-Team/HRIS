import { IsDate, IsEnum, IsISBN, IsNotEmpty, IsOptional, IsString, IsUUID, Matches } from "@nestjs/class-validator";
import { leavestatus } from "./leavestatus.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AbsentType } from "./absencetype.enum";

export class createAbsenceDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    employee_id:string;

    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    company_id:string;
    
    @ApiProperty()
    @IsEnum(AbsentType,{message:"Invalid status"})
    @IsNotEmpty()
    type:AbsentType;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    reason:string;

    @ApiPropertyOptional({example:"1970-01-01T08:57:24.123Z or 1970-01-01T08:57:24.123+07:00. Z for UTC +0 Zulu and +7 for Indonesia"})
    @Matches(
         /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|[+-]\d{2}:\d{2})$/,
         {
           message: 'Timestamp must be in ISO 8601 format (with Z or timezone offset)',
         })
    @IsOptional()
    date;

    @ApiPropertyOptional()
    @IsEnum(leavestatus,{message:"Invalid status"})
    @IsOptional()
    status:leavestatus;

    @ApiPropertyOptional({example:"1970-01-01T08:57:24.123Z or 1970-01-01T08:57:24.123+07:00. Z for UTC +0 Zulu and +7 for Indonesia"})
    @Matches(
         /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|[+-]\d{2}:\d{2})$/,
         {
           message: 'Timestamp must be in ISO 8601 format (with Z or timezone offset)',
         })
    @IsOptional()
    status_change_at;
}