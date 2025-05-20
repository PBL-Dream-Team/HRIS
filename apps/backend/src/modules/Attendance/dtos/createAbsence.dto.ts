import { IsDate, IsEnum, IsISBN, IsNotEmpty, IsOptional, IsString, IsUUID, Matches } from "@nestjs/class-validator";
import { leavestatus } from "./leavestatus.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class createAbsenceDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    employee_id:string;

    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    company_id:string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    reason:string;

    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
    date: Date;

    @ApiPropertyOptional()
    @IsEnum(leavestatus,{message:"Invalid status"})
    @IsOptional()
    status:leavestatus;

    @ApiPropertyOptional()
    @IsDate()
    @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, {
        message: 'Timestamp must be in ISO 8601 format',
    })
    @IsOptional()
    status_change_at: Date;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    absencepict: string;
}