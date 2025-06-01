import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from '@nestjs/class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsISO8601 } from 'class-validator';

export class createLetterDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  company_id: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  employee_id: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  lettertype_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  desc: string;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  valid_until: Date;

  @ApiPropertyOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  is_active: boolean;
}
