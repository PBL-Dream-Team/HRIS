import { IsDate, IsEnum, IsISBN, IsNotEmpty, IsOptional, IsString, IsUUID, Matches } from "@nestjs/class-validator";
import { leavestatus } from "./leavestatus.enum";

export class createAbsenceDto {
    @IsUUID()
    @IsNotEmpty()
    employee_id:string;

    @IsUUID()
    @IsNotEmpty()
    company_id:string;

    @IsString()
    @IsOptional()
    reason:string;

    @IsDate()
    @IsNotEmpty()
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