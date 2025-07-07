import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from '@nestjs/class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class createLetterTypeDto {
  @ApiProperty()
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @ApiPropertyOptional()
  @IsString({ message: 'content must be a string' })
  @IsOptional()
  content: string;

  @ApiProperty()
  @IsUUID(undefined, { message: 'company_id must be a valid UUID' })
  @IsNotEmpty({ message: 'company_id is required' })
  company_id: string;
}
