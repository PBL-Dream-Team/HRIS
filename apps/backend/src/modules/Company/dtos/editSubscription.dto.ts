import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from '@nestjs/class-validator';
import { SubscriptionType } from './SubscriptionType.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class editSubscriptionDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  desc: string;

  @ApiPropertyOptional()
  @IsPositive({ message: 'Value must be positive' })
  @IsInt({ message: 'Value must be an integer' })
  @IsOptional()
  max_employee: number;

  @ApiPropertyOptional()
  @IsPositive({ message: 'Value must be positive' })
  @IsInt({ message: 'Value must be an integer' })
  @IsOptional()
  price_per_employee: number;

  @ApiPropertyOptional()
  @IsEnum(SubscriptionType, { message: 'Invalid status' })
  @IsOptional()
  type: SubscriptionType;

  @ApiPropertyOptional()
  @IsPositive({ message: 'Value must be positive' })
  @IsInt({ message: 'Value must be an integer' })
  @IsOptional()
  day_length: number;
}
