import { IsAlpha, IsBoolean, IsDate, IsEmail, IsEnum, IsNumberString, IsOptional, IsString, IsUUID } from "@nestjs/class-validator";
import { workscheme } from "./workscheme.enum";
import { educationtype } from "./educationtype.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class editEmployeeDto {
    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    company_id: string;

	@ApiPropertyOptional()
    @IsEnum(workscheme, {message:""})
    @IsOptional()
    workscheme: workscheme;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    first_name: string;

	@ApiPropertyOptional()
    @IsString()
    @IsOptional()
    last_name: string;

	@ApiPropertyOptional()
    @IsAlpha()
    @IsOptional()
    gender: string;

	@ApiPropertyOptional()
    @IsString()
    @IsOptional()
    address: string;

	@ApiPropertyOptional()
    @IsEmail()
    @IsOptional()
    email: string;

	@ApiPropertyOptional()
    @IsString()
    @IsOptional()
    password:string;

	@ApiPropertyOptional()
    @IsNumberString()
    @IsOptional()
    phone:string;

	@ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    is_admin: boolean;

	@ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    attendance_id: string;

	@ApiPropertyOptional()
    @IsDate()
    @IsOptional()
    birth_date: Date;

	@ApiPropertyOptional()
    @IsString()
    @IsOptional()
    birth_place: string;

	@ApiPropertyOptional()
    @IsNumberString()
    @IsOptional()
    nik: string;

	@ApiPropertyOptional()
    @IsString()
    @IsOptional()
    position: string;

	@ApiPropertyOptional()
    @IsString()
    @IsOptional()
    branch: string;

	@ApiPropertyOptional()
    @IsEnum(educationtype, {message:""})
    @IsOptional()
    last_education: educationtype;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    pict_dir: string;

	@ApiPropertyOptional()
    @IsString()
    @IsOptional()
    google_id: string;

	@ApiPropertyOptional()
    @IsString()
    @IsOptional()
    access_token: string;

	@ApiPropertyOptional()
    @IsString()
    @IsOptional()
    refresh_token: string;
}