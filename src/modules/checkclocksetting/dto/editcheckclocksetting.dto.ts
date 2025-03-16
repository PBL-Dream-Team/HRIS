import { IsNotEmpty, IsNumber, IsString, MaxLength } from "@nestjs/class-validator";

export class editCheckClockSettingDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name: string;
    
    @IsNumber()
    @IsNotEmpty()
    type: number;
}