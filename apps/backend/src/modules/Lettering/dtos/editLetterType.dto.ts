import { IsBoolean, IsOptional, IsString, IsUUID } from '@nestjs/class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class editLetterTypeDto {
  @ApiPropertyOptional()
  @IsString({ message: 'name must be a string' })
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsString({ message: 'content must be a string' })
  @IsOptional()
  content: string;

  @ApiPropertyOptional()
  @IsUUID(undefined, { message: 'company_id must be a valid UUID' })
  @IsOptional()
  company_id: string;

  @ApiPropertyOptional()
  @IsBoolean({ message: 'is_deleted must be a boolean' })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  is_deleted: boolean;
}
