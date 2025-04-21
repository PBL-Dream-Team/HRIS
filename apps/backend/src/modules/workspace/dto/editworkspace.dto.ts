import {
  IsAlpha,
  IsAlphanumeric,
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from '@nestjs/class-validator';
import { IsUUID } from 'class-validator';

export class editWorkspaceDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsUUID()
  @IsOptional()
  subscription_id: string;

  @IsUUID()
  @IsOptional()
  created_by: string;
}
