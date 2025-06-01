import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleDto {
  @ApiProperty()
  @IsString()
  idToken: string;
}
