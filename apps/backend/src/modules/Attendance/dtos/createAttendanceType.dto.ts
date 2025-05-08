import { IsNotEmpty, IsString, IsUUID, Matches } from "@nestjs/class-validator";

export class createAttendanceTypeDto {
    @IsUUID()
    @IsNotEmpty()
    company_id:string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'startTime must be in HH:mm:ss format',
    })
    @IsNotEmpty()
    check_in: string;

    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'startTime must be in HH:mm:ss format',
    })
    @IsNotEmpty()
    check_out: string;
}