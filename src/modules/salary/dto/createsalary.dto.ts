import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, IsDateString, IsEnum } from "@nestjs/class-validator";

export class createSalaryDto {
    @IsUUID()
    @IsNotEmpty()
    employee_id: string;

    @IsEnum(['monthly', 'weekly', 'hourly'])
    @IsNotEmpty()
    type: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsDateString()
    @IsNotEmpty()
    effective_date: string;
}