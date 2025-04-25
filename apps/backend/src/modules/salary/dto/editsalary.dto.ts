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
import { SalaryType } from './createsalary.dto';

export class editSalaryDto {
  @IsUUID()
  @IsOptional()
  employee_id: string;

  @IsEnum(SalaryType)
  @IsOptional()
  type: string;

  @IsNumber()
  @IsOptional()
  amount: number;

  @IsDateString()
  @IsOptional()
  effective_date: string;
}
