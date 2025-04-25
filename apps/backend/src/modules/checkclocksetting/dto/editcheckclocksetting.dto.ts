import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class editCheckClockSettingDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  name: string;

  @IsNumber()
  @IsOptional()
  type: number;
}
