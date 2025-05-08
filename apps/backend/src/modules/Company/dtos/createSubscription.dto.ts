import { IsNotEmpty, IsOptional, IsString, IsPositive, IsInt, IsEnum } from "@nestjs/class-validator";
import { SubscriptionType } from "./SubscriptionType.enum";

export class createSubscriptionDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    desc: string;

    @IsPositive({message: "Value must be positive"})
    @IsInt({message: "Value must be an integer"})
    @IsNotEmpty()
    max_employee :number;

    @IsPositive({message: "Value must be positive"})
    @IsInt({message: "Value must be an integer"})
    @IsNotEmpty()
    price_per_employee :number;

    @IsEnum(SubscriptionType, {message: "Invalid status"})
    type: SubscriptionType;

    @IsPositive({message: "Value must be positive"})
    @IsInt({message: "Value must be an integer"})
    @IsNotEmpty()
    day_length :number;
}