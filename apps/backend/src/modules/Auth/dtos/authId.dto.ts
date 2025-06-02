import {
  IsNotEmpty,
  IsString,
  IsUUID,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthIdDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  // @IsString()
  // @IsNotEmpty()
  // name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
