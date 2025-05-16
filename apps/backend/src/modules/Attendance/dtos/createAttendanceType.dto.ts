import { IsNotEmpty, IsString, IsUUID, Matches } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class createAttendanceTypeDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    company_id:string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'startTime must be in HH:mm:ss format',
    })
    @IsNotEmpty()
    check_in: string;

    @ApiProperty()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'startTime must be in HH:mm:ss format',
    })
    @IsNotEmpty()
    check_out: string;
}