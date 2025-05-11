import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, IsUUID } from "@nestjs/class-validator";

export class AuthIdDto {
    @IsUUID()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    password:string;
}