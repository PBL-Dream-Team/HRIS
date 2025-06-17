import {
  IsAlpha,
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
  @IsNotEmpty({ message: 'name is required' })
  @IsString({ message: 'name must be a string' })
  name: string;
  // Admin Fields
  @ApiProperty()
  @IsAlpha('first_name must be a string')
  @IsNotEmpty({ message: 'first_name is required' })
  first_name: string;

  @ApiProperty()
  @IsAlpha('last_name must be a string')
  @IsNotEmpty({ message: 'last_name is required' })
  last_name: string;

  @ApiProperty()
  @IsEmail({}, { message: 'email must be a valid email address' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @ApiProperty()
  @Length(8, 20, {
    message: 'Password must be between 8 and 20 characters',
  })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).+$/, {
    message:
      'Password must contain at least one uppercase letter, one number, and one symbol',
  })
  @IsNotEmpty({ message: 'password is required' })
  password: string;

  @ApiProperty()
  @IsNumberString({}, { message: 'phone must be a number string' })
  @IsNotEmpty({ message: 'phone is required' })
  phone: string;
}
