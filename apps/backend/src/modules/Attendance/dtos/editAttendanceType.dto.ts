import { IsNotEmpty, IsOptional, IsString, IsUUID, Matches } from "@nestjs/class-validator";

export class editAttendanceTypeDto {
    @IsUUID()
    @IsOptional()
    company_id:string;

    @IsString()
    @IsOptional()
    name: string;

    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'startTime must be in HH:mm:ss format',
    })
    @IsOptional()
    check_in: string;

    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'startTime must be in HH:mm:ss format',
    })
    @IsOptional()
    check_out: string;
}