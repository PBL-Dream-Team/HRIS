import {
  IsAlpha,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  MaxLength,
} from '@nestjs/class-validator';
import { workscheme } from './workscheme.enum';
import { educationtype } from './educationtype.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { contracttype } from './contracttype.enum';
import { BankCode } from './bankcode.enum';
import { Transform } from 'class-transformer';

export class createEmployeeDto {
  @ApiProperty()
  @IsUUID(undefined, { message: 'company_id must be a valid UUID' })
  @IsNotEmpty({ message: 'company_id must be filled' })
  company_id: string;

  @ApiProperty()
  @IsEnum(workscheme, { message: 'workscheme must be a valid workscheme' })
  @IsNotEmpty({ message: 'workscheme must be filled' })
  workscheme: workscheme;

  @ApiProperty()
  @IsAlpha(undefined, { message: 'first_name must be a string' })
  @IsNotEmpty({ message: 'first_name must be filled' })
  first_name: string;

  @ApiProperty()
  @IsAlpha(undefined, { message: 'last_name must be a string' })
  @IsNotEmpty({ message: 'last_name must be filled' })
  last_name: string;

  @ApiPropertyOptional()
  @IsAlpha(undefined, { message: 'gender must only contain letters' })
  @IsOptional()
  gender: string;

  @ApiPropertyOptional()
  @IsString({ message: 'address must be a string' })
  @IsOptional()
  address: string;

  @ApiProperty()
  @IsEmail({}, { message: 'email must be a valid email address' })
  @IsNotEmpty({ message: 'email must be filled' })
  email: string;

  @ApiProperty()
  @Length(8, 20, {
      message: 'Password must be between 8 and 20 characters',
    })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).+$/, {
      message:
        'Password must contain at least one uppercase letter, one number, and one symbol',
  })
  @IsNotEmpty({ message: 'password must be filled' })
  password: string;

  @ApiPropertyOptional()
  @IsNumberString({}, { message: 'phone must be a number string' })
  @IsNotEmpty({ message: 'phone must be filled' })
  phone: string;

  @ApiPropertyOptional()
  @IsBoolean({ message: 'is_admin must be a boolean' })
  @IsOptional()
  is_admin: boolean;

  @ApiProperty()
  @IsUUID(undefined, { message: 'attendance_id must be a valid UUID' })
  @IsNotEmpty({ message: 'attendance_id must be filled' })
  attendance_id: string;

  @ApiPropertyOptional()
  @IsDate({ message: 'birth_date must be a valid date' })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  birth_date: Date;

  @ApiPropertyOptional()
  @IsString({ message: 'birth_place must be a string' })
  @IsOptional()
  birth_place: string;

  @ApiPropertyOptional()
  @IsNumberString({}, { message: 'nik must be a number string' })
  @MaxLength(16, { message: 'nik must be at most 16 characters' })
  @IsOptional()
  nik: string;

  @ApiPropertyOptional()
  @IsString({ message: 'position must be a string' })
  @IsOptional()
  position: string;

  @ApiPropertyOptional()
  @IsString({ message: 'branch must be a string' })
  @IsOptional()
  branch: string;

  @ApiPropertyOptional()
  @IsEnum(contracttype, { message: 'contract must be a valid contracttype' })
  @IsOptional()
  contract: contracttype;

  @ApiPropertyOptional()
  @IsEnum(educationtype, { message: 'last_education must be a valid educationtype' })
  @IsOptional()
  last_education: educationtype;

  @ApiPropertyOptional({
    example: {
      /*
            enum BankCode {
            BRI       // 002
            Mandiri   // 008
            BNI       // 009
            Danamon   // 011
            Permata   // 013
            BCA       // 014
            Maybank   // 016
            Panin     // 019
            Bukopin   // 020
            CIMB      // 022
            UOB       // 023
            OCBC      // 028
            BJB       // 110
            Muamalat  // 147
            BTN       // 200
            BTPN      // 213
            Mega      // 426
            SyariahMandiri // 451
            Commonwealth   // 950
            }
            */
    },
  })
  @IsEnum(BankCode, { message: 'account_bank must be a valid BankCode' })
  @IsOptional()
  account_bank: string;

  @ApiPropertyOptional()
  @IsNumberString({}, { message: 'account_number must be a number string' })
  @IsOptional()
  account_number: string;

  @ApiPropertyOptional()
  @IsString({ message: 'account_name must be a string' })
  @IsOptional()
  account_name: string;

  @ApiPropertyOptional()
  @IsString({ message: 'google_id must be a string' })
  @IsOptional()
  google_id: string;

  @ApiPropertyOptional()
  @IsString({ message: 'access_token must be a string' })
  @IsOptional()
  access_token: string;

  @ApiPropertyOptional()
  @IsString({ message: 'refresh_token must be a string' })
  @IsOptional()
  refresh_token: string;
}
