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
  @IsString( { message: 'Name must be a string' })
  @IsNotEmpty( { message: 'Name is required' })
  name: string;

  @ApiProperty()
  @IsString( { message: 'Description must be a string' })
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
  @IsNotEmpty(  { message: 'Price per employee is required' })
  price_per_employee: number;

  @ApiProperty()
  @IsEnum(SubscriptionType, { message: 'Invalid status' })
  type: SubscriptionType;

  @ApiProperty()
  @IsPositive({ message: 'Value must be positive' })
  @IsInt({ message: 'Value must be an integer' })
  @IsNotEmpty( { message: 'Subscription length is required' })
  day_length: number;
}
