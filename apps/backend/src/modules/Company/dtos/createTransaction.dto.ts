import {IsDecimal, IsInt, IsNotEmpty, IsNumber, IsUUID, Min } from '@nestjs/class-validator'
import { ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

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
    @IsDecimal({ decimal_digits: '0,2' })
    @Transform(({value})=> new Decimal(value), { toClassOnly: true })
    @IsOptional()
    taxrate?: Decimal;
}