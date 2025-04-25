import { Transform } from '@nestjs/class-transformer';
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

export class editUserDto {
  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  email: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsNumberString()
  @IsOptional()
  @MaxLength(100)
  phone: string;

  @IsOptional()
  @IsBoolean()
  is_admin: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  first_name: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  last_name: string;

  @IsAlpha()
  @IsString()
  @IsOptional()
  @MaxLength(1)
  @Transform(({ value }) => value.toUpperCase())
  @IsIn(['M', 'F'])
  gender: string;

  @IsAlphanumeric()
  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  google_id: string;

  @IsString()
  @IsOptional()
  access_token: string;

  @IsString()
  @IsOptional()
  refresh_token: string;
}
