import { IsDate, IsDateString, IsEmail, IsEnum, IsInt, IsISO8601, IsLatitude, IsLongitude, IsNotEmpty, IsPositive, IsString, IsUUID, Matches } from "@nestjs/class-validator";
import { CompanySubscriptionStatus } from "@prisma/client";

export class RegDto{
    // Company Fields
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

    @IsISO8601()
    @IsNotEmpty()
    subs_date_start: string;

    @IsISO8601()
    @IsNotEmpty()
    subs_date_end: string;

    @IsEnum(CompanySubscriptionStatus,{message:"Invalid status"})
    status: CompanySubscriptionStatus


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