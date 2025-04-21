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
import { SubscriptionStatus, SubscriptionType } from './createSubs.dto';

export class editSubsDto {
  @IsUUID()
  @IsOptional()
  user_id: string;

  @IsEnum(SubscriptionType)
  @IsOptional()
  type: string;

  @IsEnum(SubscriptionStatus)
  @IsOptional()
  status: string;

  @IsISO8601()
  @IsOptional()
  start_date: string;

  @IsISO8601()
  @IsOptional()
  update_date: string;
}
