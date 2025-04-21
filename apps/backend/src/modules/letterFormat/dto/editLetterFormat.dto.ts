import { IsOptional, IsString, IsNumber } from '@nestjs/class-validator';

export class editLetterFormatDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsNumber()
  @IsOptional()
  status: number;
}
