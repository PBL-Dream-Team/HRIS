import {IsDateString, IsEnum, IsInt, IsLatitude, IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID } from '@nestjs/class-validator'
import { CompanySubscriptionStatus } from './CompanySubscriptionStatus.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class editCompanyDto {
        @ApiPropertyOptional()
        @IsOptional()
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
        @IsLatitude()
        @IsOptional()
        loc_long: number;
    
        @ApiPropertyOptional()
        @IsUUID()
        @IsOptional()
        subscription_id: string;
    
        @ApiPropertyOptional()
        @IsPositive({message: "Value must be positive"})
        @IsInt({message: "Value must be an integer"})
        @IsOptional()
        max_employee :number;
    
        @ApiPropertyOptional()
        @IsDateString()
        @IsOptional()
        subs_date_start: Date;
    
        @ApiPropertyOptional()
        @IsDateString()
        @IsOptional()
        subs_date_end: Date;

        @ApiPropertyOptional()
        @IsEnum(CompanySubscriptionStatus,{message:"Invalid status"})
        @IsOptional()
        status: CompanySubscriptionStatus
}