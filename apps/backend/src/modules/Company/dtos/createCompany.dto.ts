import {IsDate, IsDateString, IsEnum, IsInt, IsLatitude, IsLongitude, IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID, Matches } from '@nestjs/class-validator'
import { CompanySubscriptionStatus } from './CompanySubscriptionStatus.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class createCompanyDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

	@ApiPropertyOptional()
    @IsString()
    @IsOptional()
    address:string;

	@ApiPropertyOptional()
    @IsLatitude()
    @IsOptional()
    loc_lat: number;

	@ApiPropertyOptional()
    @IsLongitude()
    @IsOptional()
    loc_long: number;

	@ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    subscription_id: string;

	@ApiProperty()
    @IsPositive({message: "Value must be positive"})
    @IsInt({message: "Value must be an integer"})
    @IsNotEmpty()
    max_employee :number;

	@ApiProperty()
    @IsDate()
    @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, {
        message: 'Timestamp must be in ISO 8601 format',
    })
    @IsNotEmpty()
    subs_date_start: Date;

	@ApiProperty()
    @IsDate()
    @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, {
        message: 'Timestamp must be in ISO 8601 format',
    })
    @IsNotEmpty()
    subs_date_end: Date;

	@ApiProperty()
    @IsEnum(CompanySubscriptionStatus,{message:"Invalid status"})
    status: CompanySubscriptionStatus
}