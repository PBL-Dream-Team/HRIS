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

export class createWorkspaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  @IsNotEmpty()
  subscription_id: string;

  @IsUUID()
  @IsNotEmpty()
  created_by: string;
}
