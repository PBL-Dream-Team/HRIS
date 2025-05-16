import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, IsUUID } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AuthEmailDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    input: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password:string;
}