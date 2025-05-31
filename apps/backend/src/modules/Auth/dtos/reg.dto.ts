import { IsEmail, IsNotEmpty, IsNumberString, IsString} from "@nestjs/class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class RegDto{
    // Company Fields
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;
    // Admin Fields
    @IsString()
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @IsNotEmpty()
    last_name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password:string;

    @IsNumberString()
    @IsNotEmpty()
    phone: string;
}