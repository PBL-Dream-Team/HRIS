import {
  IsOptional,
  IsUUID,
  IsNumber,
  IsBoolean,
  IsString,
} from 'class-validator';

export class updatePaymentDto {
  @IsUUID()
  @IsOptional()
  user_id: string;

  @IsString()
  @IsOptional()
  xendit_transaction_id: string;

  @IsNumber()
  @IsOptional()
  amount: number;
}
