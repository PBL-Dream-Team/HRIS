import {
  IsDecimal,
  IsInt,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
} from '@nestjs/class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { Transform } from 'class-transformer';

export class editTransactionDto {
  @ApiProperty()
  @IsUUID()
  @IsOptional()
  company_id: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  subscription_id: string;

  @ApiProperty()
  @IsNumber()
  @IsInt()
  @Min(0)
  @IsOptional()
  total: number;

  @ApiPropertyOptional()
    @Transform(({ value }) => new Decimal(value))
    @IsOptional()
  taxRate?;
}
