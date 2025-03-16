import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, IsDateString, IsEnum } from "@nestjs/class-validator";

export class editSalaryDto {
    @IsUUID()
    @IsOptional()
    employee_id: string;

    @IsEnum(['monthly', 'weekly', 'hourly'])
    @IsOptional()
    type: string;

    @IsNumber()
    @IsOptional()
    amount: number;

    @IsDateString()
    @IsOptional()
    effective_date: string;
}