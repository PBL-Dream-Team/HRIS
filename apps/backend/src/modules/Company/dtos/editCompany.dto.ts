import {IsDateString, IsEnum, IsInt, IsLatitude, IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID } from '@nestjs/class-validator'
import { CompanySubscriptionStatus } from './CompanySubscriptionStatus.enum';

export class editCompanyDto {
        @IsOptional()
        @IsString()
        name: string;
    
        @IsString()
        @IsOptional()
        address:string;
    
        @IsLatitude()
        @IsOptional()
        loc_lat: number;
    
        @IsLatitude()
        @IsOptional()
        loc_long: number;
    
        @IsUUID()
        @IsOptional()
        subscription_id: string;
    
        @IsPositive({message: "Value must be positive"})
        @IsInt({message: "Value must be an integer"})
        @IsOptional()
        max_employee :number;
    
        @IsDateString()
        @IsOptional()
        subs_date_start: Date;
    
        @IsDateString()
        @IsOptional()
        subs_date_end: Date;

        @IsEnum(CompanySubscriptionStatus,{message:"Invalid status"})
        @IsOptional()
        status: CompanySubscriptionStatus
}