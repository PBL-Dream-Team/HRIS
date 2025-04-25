import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateLetterFormatDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  status: number;
}
