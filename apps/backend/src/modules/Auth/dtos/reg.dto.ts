import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  Matches,
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
  @Length(8, 20, {
    message: 'Password must be between 8 and 20 characters',
  })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).+$/, {
    message:
      'Password must contain at least one uppercase letter, one number, and one symbol',
  })
  password: string;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  phone: string;
}
