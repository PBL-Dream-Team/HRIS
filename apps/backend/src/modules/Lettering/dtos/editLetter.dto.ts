import {
  IsBoolean,
  IsDate,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from '@nestjs/class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

export class editLetterDto {
  @ApiPropertyOptional()
  @IsUUID(undefined, { message: 'company_id must be a valid UUID' })
  @IsOptional()
  company_id: string;

  @ApiPropertyOptional()
  @IsUUID(undefined, { message: 'employee_id must be a valid UUID' })
  @IsOptional()
  employee_id: string;

  @ApiPropertyOptional()
  @IsUUID(undefined, { message: 'lettertype_id must be a valid UUID' })
  @IsOptional()
  lettertype_id: string;

  @ApiPropertyOptional()
  @IsString({ message: 'name must be a string' })
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsString({ message: 'desc must be a string' })
  @IsOptional()
  desc: string;

  @ApiPropertyOptional()
  @IsDate({ message: 'valid_until must be a valid date' })
  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  valid_until: Date;

  @ApiPropertyOptional()
  @IsBoolean({ message: 'is_active must be a boolean' })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  is_active: boolean;

  @ApiPropertyOptional()
  @IsBoolean({ message: 'is_deleted must be a boolean' })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  is_deleted: boolean;
}
