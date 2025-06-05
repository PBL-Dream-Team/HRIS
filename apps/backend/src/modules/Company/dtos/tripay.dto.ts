import { IsString, IsNumber, IsOptional, IsNumberString } from 'class-validator';

export class TripayTransactionDto {
  @IsString()
  company_id: string;

  @IsString()
  subscription_id: string;

  @IsString()
  title: string;

  @IsNumber()
  price: number;

  @IsNumber()
  employeeCount: number;

  @IsString()
  type: 'single' | 'payg';

  @IsString()
  method: string;

  @IsNumber()
  amount: number;

  @IsString()
  merchant_ref: string;

  @IsNumber()
  expired: number;

  @IsNumberString()
  @IsOptional()
  phone: string;
}
