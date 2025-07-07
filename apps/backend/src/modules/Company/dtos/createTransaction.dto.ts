import {
  IsDecimal,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  Min,
} from '@nestjs/class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, Matches } from 'class-validator';
import { transactionStatus } from './transactionStatus.enum';

export class createTransactionDto {
  @ApiProperty()
  @IsUUID( 'all', { message: 'Company ID must be a valid UUID' })
  @IsNotEmpty( { message: 'Company ID is required' })
  company_id: string;

  @ApiProperty()
  @IsUUID( 'all',  { message: 'Subscription ID must be a valid UUID' })
  @IsNotEmpty( { message: 'Subscription ID is required' })
  subscription_id: string;

  @ApiProperty()
  @IsNumber()
  @IsInt( { message: 'Total must be an integer' })
  @Min(0, { message: 'Total must be zero or above' })
  @IsNotEmpty( { message: 'Total is required' })
  total: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => new Decimal(value))
  @IsOptional()
  taxRate?;

  @ApiProperty()
  @IsString( { message: 'merchantRef must be a string' })
  @IsNotEmpty( { message: 'merchantRef is required' })
  merchantRef: string;

  @ApiPropertyOptional({
    example:
      '1970-01-01T08:57:24.123Z or 1970-01-01T08:57:24.123+07:00. Z for UTC +0 Zulu and +7 for Indonesia',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|[+-]\d{2}:\d{2})$/, {
    message: 'Timestamp must be in ISO 8601 format (with Z or timezone offset)',
  })
  @IsOptional()
  expiresAt;

  @ApiPropertyOptional()
  @IsEnum(transactionStatus)
  @IsOptional()
  status: transactionStatus;

  @ApiPropertyOptional({
    example:
      '1970-01-01T08:57:24.123Z or 1970-01-01T08:57:24.123+07:00. Z for UTC +0 Zulu and +7 for Indonesia',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|[+-]\d{2}:\d{2})$/, {
    message: 'Timestamp must be in ISO 8601 format (with Z or timezone offset)',
  })
  @IsOptional()
  paidAt;
}
