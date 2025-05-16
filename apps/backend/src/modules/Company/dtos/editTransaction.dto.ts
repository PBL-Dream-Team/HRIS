import {IsInt, IsNumber, IsOptional, IsUUID, Min } from '@nestjs/class-validator'
import { ApiProperty} from '@nestjs/swagger';

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
}