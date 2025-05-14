import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, IsUUID } from "@nestjs/class-validator";

export class AuthEmailDto {
    @IsString()
    @IsNotEmpty()
    input: string;

    @IsString()
    @IsNotEmpty()
    password:string;
}