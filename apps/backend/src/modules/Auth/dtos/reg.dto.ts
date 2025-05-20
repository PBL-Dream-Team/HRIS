import { IsDate, IsDateString, IsEmail, IsEnum, IsInt, IsISO8601, IsLatitude, IsLongitude, IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID, Matches } from "@nestjs/class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CompanySubscriptionStatus } from "@prisma/client";

export class RegDto{
    // Company Fields
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;
    // Admin Fields
    @IsString()
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @IsNotEmpty()
    last_name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password:string;

}