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
  @IsUUID()
  @IsNotEmpty()
  company_id: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  subscription_id: string;

  @ApiProperty()
  @IsNumber()
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  total: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => new Decimal(value))
  @IsOptional()
  taxRate?;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  merchantRef: number;

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
}
