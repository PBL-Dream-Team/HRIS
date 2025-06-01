import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegDto {
  // Company Fields
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
  // Admin Fields
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  phone: string;
}
