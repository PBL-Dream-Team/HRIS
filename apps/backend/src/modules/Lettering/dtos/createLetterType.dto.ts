import { IsNotEmpty, IsOptional, IsString, IsUUID } from "@nestjs/class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class createLetterTypeDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name:string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    content:string;

    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    company_id:string;
}