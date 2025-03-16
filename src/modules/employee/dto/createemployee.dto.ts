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
    is_hr: boolean;

    @IsDateString()
    @IsNotEmpty()
    joined_at: string;
}
