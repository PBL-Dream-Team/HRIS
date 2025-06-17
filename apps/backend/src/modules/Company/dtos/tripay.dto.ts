import { IsString, IsNumber, IsOptional, IsNumberString } from 'class-validator';

export class TripayTransactionDto {
  @IsString( { message: 'Company ID must be a string' })
  company_id: string;

  @IsString( { message: 'Subscription ID must be a string' })
  subscription_id: string;

  @IsString( { message: 'Title must be a string' })
  title: string;

  @IsNumber(  {} , { message: 'Price must be a number' })
  price: number;

  @IsNumber( {}, { message: 'Employee count must be a number' })
  employeeCount: number;

  @IsString( { message: 'Type must be a string' })
  type: 'single' | 'payg';

  @IsString( { message: 'Method must be a string' })
  method: string;

  @IsNumber( {}, { message: 'Amount must be a number' })
  amount: number;

  @IsString( { message: 'Merchant reference must be a string' })
  merchant_ref: string;

  @IsNumber( {}, { message: 'Expired must be a number' })
  expired: number;

  @IsNumberString( {}, { message: 'Phone must be a number string' })
  @IsOptional()
  phone: string;
}
