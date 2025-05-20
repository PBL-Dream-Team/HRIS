import { IsDate, IsEnum, IsOptional, IsString, IsUUID, Matches } from "@nestjs/class-validator";
import { leavestatus } from "./leavestatus.enum";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class editAbsenceDto {
    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    employee_id:string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    reason:string;

    @ApiPropertyOptional()
    @IsDate()
    @IsOptional()
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

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    absencepict: string;
}