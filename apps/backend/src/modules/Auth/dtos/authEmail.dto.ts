import {
  IsNotEmpty,
  IsString,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthEmailDto {
  @ApiProperty()
  @IsString({ message: 'input must be a string' })
  @IsNotEmpty({ message: 'input is required' })
  input: string;

  @ApiProperty()
  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'password is required' })
  password: string;
}
