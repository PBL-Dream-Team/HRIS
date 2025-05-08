import {IsDate, IsDateString, IsEnum, IsInt, IsLatitude, IsLongitude, IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID, Matches } from '@nestjs/class-validator'
import { CompanySubscriptionStatus } from './CompanySubscriptionStatus.enum';

export class createCompanyDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    @IsNotEmpty()
    address:string;

    @IsLatitude()
    @IsNotEmpty()
    loc_lat: number;

    @IsLongitude()
    @IsNotEmpty()
    loc_long: number;

    @IsUUID()
    @IsNotEmpty()
    subscription_id: string;

    @IsPositive({message: "Value must be positive"})
    @IsInt({message: "Value must be an integer"})
    @IsNotEmpty()
    max_employee :number;

    @IsDate()
    @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, {
        message: 'Timestamp must be in ISO 8601 format',
    })
    @IsNotEmpty()
    subs_date_start: Date;

    @IsDate()
    @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, {
        message: 'Timestamp must be in ISO 8601 format',
    })
    @IsNotEmpty()
    subs_date_end: Date;

    @IsEnum(CompanySubscriptionStatus,{message:"Invalid status"})
    status: CompanySubscriptionStatus
}