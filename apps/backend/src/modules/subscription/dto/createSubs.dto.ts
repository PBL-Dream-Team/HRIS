import {
  IsAlpha,
  IsAlphanumeric,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsIn,
  IsISO8601,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from '@nestjs/class-validator';

export enum SubscriptionType {
  Trial = 'Trial',
  Paid = 'Paid',
}
export enum SubscriptionStatus {
  Active = 'Active',
  Expired = 'Expired',
  Canceled = 'Canceled',
}

export class createSubsDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsEnum(SubscriptionType)
  @IsNotEmpty()
  type: string;

  @IsEnum(SubscriptionStatus)
  @IsNotEmpty()
  status: string;

  @IsISO8601()
  @IsNotEmpty()
  start_date: string;

  @IsISO8601()
  @IsNotEmpty()
  update_date: string;
}
