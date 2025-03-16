import { Transform } from "@nestjs/class-transformer";
import { IsUUID, IsNotEmpty, IsBoolean, IsDateString } from "@nestjs/class-validator";

export class createEmployeeDto {
    @IsUUID()
    @IsNotEmpty()
    user_id: string;

    @IsUUID()
    @IsNotEmpty()
    workspace_id: string;

    @IsUUID()
    @IsNotEmpty()
    ck_time_id: string;

    @IsBoolean()
    @IsNotEmpty()
    @Transform(({ value }) => value.toBoolean())
    is_hr: boolean;

    @IsDateString()
    @IsNotEmpty()
    joined_at: string;
}
