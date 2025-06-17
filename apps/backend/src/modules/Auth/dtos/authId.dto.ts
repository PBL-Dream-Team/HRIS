import {
  IsNotEmpty,
  IsString,
  IsUUID,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthIdDto {
  @ApiProperty()
  @IsUUID('4', { message: 'id must be a valid UUID' })
  @IsNotEmpty()
  id: string;

  // @IsString()
  // @IsNotEmpty()
  // name: string;

  @ApiProperty()
  @IsString({ message: 'password must be a string' })
  @IsNotEmpty()
  password: string;
}
