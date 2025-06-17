import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID
} from '@nestjs/class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

export class createLetterDto {
  @ApiProperty()
  @IsUUID(undefined, { message: 'company_id must be a valid UUID' })
  @IsNotEmpty({ message: 'company_id is required' })
  company_id: string;

  @ApiProperty()
  @IsUUID(undefined, { message: 'employee_id must be a valid UUID' })
  @IsNotEmpty({ message: 'employee_id is required' })
  employee_id: string;

  @ApiProperty()
  @IsUUID(undefined, { message: 'lettertype_id must be a valid UUID' })
  @IsNotEmpty({ message: 'lettertype_id is required' })
  lettertype_id: string;

  @ApiProperty()
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @ApiPropertyOptional()
  @IsString({ message: 'desc must be a string' })
  @IsOptional()
  desc: string;

  @ApiProperty()
  @IsDate({ message: 'valid_until must be a valid date' })
  @IsNotEmpty({ message: 'valid_until is required' })
  @Transform(({ value }) => new Date(value))
  valid_until: Date;

  @ApiPropertyOptional()
  @IsBoolean({ message: 'is_active must be a boolean' })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  is_active: boolean;
}
