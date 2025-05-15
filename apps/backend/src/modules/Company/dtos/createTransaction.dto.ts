import {IsInt, IsNotEmpty, IsNumber, IsUUID, Min } from '@nestjs/class-validator'
import { ApiProperty} from '@nestjs/swagger';

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
}