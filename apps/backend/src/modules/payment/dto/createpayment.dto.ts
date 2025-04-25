import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from '@nestjs/class-validator';

export class createPaymentDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  xendit_transaction_id: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
