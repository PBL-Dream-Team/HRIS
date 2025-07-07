import {
  IsDate,
  IsDateString,
  IsEnum,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Matches,
} from '@nestjs/class-validator';
import { CompanySubscriptionStatus } from './CompanySubscriptionStatus.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class createCompanyDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'name is required' })
  @IsString({ message: 'name must be a string' })
  name: string;

  @ApiPropertyOptional()
  @IsString({ message: 'address must be a string' })
  @IsOptional()
  address: string;

  @ApiPropertyOptional()
  @IsLatitude({ message: 'loc_lat must be a valid latitude' })
  @IsOptional()
  loc_lat: number;

  @ApiPropertyOptional()
  @IsLongitude({ message: 'loc_long must be a valid longitude' })
  @IsOptional()
  loc_long: number;

  @ApiProperty()
  @IsUUID(undefined, { message: 'subscription_id must be a valid UUID' })
  @IsNotEmpty({ message: 'subscription_id is required' })
  subscription_id: string;

  @ApiProperty()
  @IsPositive({ message: 'max_employee must be positive' })
  @IsInt({ message: 'max_employee must be an integer' })
  @IsNotEmpty({ message: 'max_employee is required' })
  max_employee: number;

  @ApiProperty({
    example:
      '1970-01-01T08:57:24.123Z or 1970-01-01T08:57:24.123+07:00. Z for UTC +0 Zulu and +7 for Indonesia',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|[+-]\d{2}:\d{2})$/, {
    message: 'subs_date_start must be in ISO 8601 format (with Z or timezone offset)',
  })
  @IsNotEmpty({ message: 'subs_date_start is required' })
  subs_date_start;

  @ApiProperty({
    example:
      '1970-01-01T08:57:24.123Z or 1970-01-01T08:57:24.123+07:00. Z for UTC +0 Zulu and +7 for Indonesia',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|[+-]\d{2}:\d{2})$/, {
    message: 'subs_date_end must be in ISO 8601 format (with Z or timezone offset)',
  })
  @IsNotEmpty({ message: 'subs_date_end is required' })
  subs_date_end;

  @ApiProperty()
  @IsEnum(CompanySubscriptionStatus, { message: 'status must be a valid CompanySubscriptionStatus' })
  status: CompanySubscriptionStatus;
}
