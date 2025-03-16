import { IsUUID, IsOptional, IsBoolean, IsDateString } from "@nestjs/class-validator";

export class editEmployeeDto {
    @IsUUID()
    @IsOptional()
    user_id: string;

    @IsUUID()
    @IsOptional()
    workspace_id: string;

    @IsUUID()
    @IsOptional()
    ck_time_id: string;

    @IsBoolean()
    @IsOptional()
    is_hr: boolean;

    @IsDateString()
    @IsOptional()
    joined_at: string;
}
