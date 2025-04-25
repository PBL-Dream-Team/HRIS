import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class createCheckClockSettingDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsNumber()
  @IsNotEmpty()
  type: number;
}
