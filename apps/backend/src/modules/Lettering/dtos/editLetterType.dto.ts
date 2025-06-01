import { IsOptional, IsString, IsUUID } from '@nestjs/class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class editLetterTypeDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  content: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  company_id: string;
}
