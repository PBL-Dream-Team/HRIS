import { Type } from "@nestjs/class-transformer";
import { IsDate, IsISO8601, IsNotEmpty, IsString, IsUUID, Matches } from "@nestjs/class-validator";

export class createCheckClockSettingTimeDto {
    @IsUUID()
    @IsNotEmpty()
    ck_settings_id: string;

    @Type(() => Date)
    @IsISO8601()
    @IsNotEmpty()
    day: Date;

    @IsString()
    @IsNotEmpty()
    clock_in: string;

    @IsString()
    @IsNotEmpty()
    clock_out: string;

    @IsString()
    @IsNotEmpty()
    break_start: string;

    @IsString()
    @IsNotEmpty()
    break_end: string;
}