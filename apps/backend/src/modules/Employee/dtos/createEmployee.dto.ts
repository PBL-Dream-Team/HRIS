import { IsAlpha, IsBoolean, IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, IsUUID } from "@nestjs/class-validator";
import { workscheme } from "./workscheme.enum";
import { educationtype } from "./educationtype.enum";

export class createEmployeeDto {
    @IsUUID()
    @IsNotEmpty()
    company_id: string;

    @IsEnum(workscheme, {message:""})
    @IsOptional()
    workscheme: workscheme

    @IsString()
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @IsNotEmpty()
    last_name: string;

    @IsAlpha()
    @IsOptional()
    gender: string;

    @IsString()
    @IsOptional()
    address: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password:string;

    @IsNumberString()
    @IsOptional()
    phone:string;

    @IsBoolean()
    @IsOptional()
    is_admin: boolean;

    @IsUUID()
    @IsOptional()
    attendance_id: string;

    @IsDate()
    @IsOptional()
    birth_date: Date;

    @IsString()
    @IsOptional()
    birth_place: string;

    @IsNumberString()
    @IsOptional()
    nik: string;

    @IsString()
    @IsOptional()
    position: string;

    @IsString()
    @IsOptional()
    branch: string;

    @IsEnum(educationtype, {message:""})
    @IsOptional()
    last_education: educationtype

    @IsString()
    @IsOptional()
    pict_dir: string;

    @IsString()
    @IsOptional()
    google_id: string;

    @IsString()
    @IsOptional()
    access_token: string;

    @IsString()
    @IsOptional()
    refresh_token: string;
}