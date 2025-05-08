import { IsDate, IsEnum, IsOptional, IsString, IsUUID, Matches } from "@nestjs/class-validator";
import { leavestatus } from "./leavestatus.enum";

export class editAbsenceDto {
    @IsUUID()
    @IsOptional()
    employee_id:string;

    @IsString()
    @IsOptional()
    reason:string;

    @IsDate()
    @IsOptional()
    date: Date;

    @IsEnum(leavestatus,{message:"Invalid status"})
    @IsOptional()
    status:leavestatus;

    @IsDate()
    @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, {
        message: 'Timestamp must be in ISO 8601 format',
    })
    @IsOptional()
    status_change_at: Date;
}