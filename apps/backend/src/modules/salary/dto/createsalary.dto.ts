import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
  IsEnum,
} from 'class-validator';

export enum SalaryType {
  Monthly = 'monthly',
  Weekly = 'weekly',
  Hourly = 'hourly',
}

export class createSalaryDto {
  @IsUUID()
  @IsNotEmpty()
  employee_id: string;

  @IsEnum(SalaryType)
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsDateString()
  @IsNotEmpty()
  effective_date: string;
}
