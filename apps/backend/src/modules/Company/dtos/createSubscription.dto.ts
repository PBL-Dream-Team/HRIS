import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsPositive,
  IsInt,
  IsEnum,
  Min,
} from '@nestjs/class-validator';
import { SubscriptionType } from './SubscriptionType.enum';
import { ApiProperty } from '@nestjs/swagger';

export class createSubscriptionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  desc: string;

  @ApiProperty()
  @IsPositive({ message: 'Value must be positive' })
  @IsInt({ message: 'Value must be an integer' })
  @IsOptional()
  max_employee: number;

  @ApiProperty()
  @Min(0, { message: 'Value must be zero or above' })
  @IsInt({ message: 'Value must be an integer' })
  @IsNotEmpty()
  price_per_employee: number;

  @ApiProperty()
  @IsEnum(SubscriptionType, { message: 'Invalid status' })
  type: SubscriptionType;

  @ApiProperty()
  @IsPositive({ message: 'Value must be positive' })
  @IsInt({ message: 'Value must be an integer' })
  @IsNotEmpty()
  day_length: number;
}
