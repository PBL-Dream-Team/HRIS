import { Transform } from "@nestjs/class-transformer";
import { IsAlpha, IsAlphanumeric, IsBoolean, IsEmail, IsIn, IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength } from "@nestjs/class-validator";

export class createUserDto{
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(100)
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNumberString()
    @IsNotEmpty()
    @MaxLength(100)
    phone: string;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value.toBoolean())
    is_admin: boolean;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    first_name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    last_name: string;

    @IsAlpha()
    @IsString()
    @IsNotEmpty()
    @MaxLength(1)
    @Transform(({ value }) => value.toUpperCase())
    @IsIn(['M','F'])
    gender: string;

    @IsAlphanumeric()
    @IsString()
    @IsOptional()
    address: string;

    @IsString()
    @IsOptional()
    google_id :string;

    @IsString()
    @IsOptional()
    access_token: string;

    @IsString()
    @IsOptional()
    refresh_token: string;
}
