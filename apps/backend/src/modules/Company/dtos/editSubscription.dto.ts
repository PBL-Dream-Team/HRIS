import { IsEnum, IsInt, IsOptional, IsPositive, IsString } from "@nestjs/class-validator";
import { SubscriptionType } from "./SubscriptionType.enum";

export class editSubscriptionDto {
        @IsString()
        @IsOptional()
        name: string;
    
        @IsString()
        @IsOptional()
        desc: string;
    
        @IsPositive({message: "Value must be positive"})
        @IsInt({message: "Value must be an integer"})
        @IsOptional()
        max_employee :number;
    
        @IsPositive({message: "Value must be positive"})
        @IsInt({message: "Value must be an integer"})
        @IsOptional()
        price_per_employee :number;
    
        @IsEnum(SubscriptionType, {message: "Invalid status"})
        @IsOptional()
        type: SubscriptionType;
    
        @IsPositive({message: "Value must be positive"})
        @IsInt({message: "Value must be an integer"})
        @IsOptional()
        day_length :number;
}