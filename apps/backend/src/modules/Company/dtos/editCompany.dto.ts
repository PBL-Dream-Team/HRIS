import {
  IsEnum,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Matches,
} from '@nestjs/class-validator';
import { CompanySubscriptionStatus } from './CompanySubscriptionStatus.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class editCompanyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString( { message: 'Name must be a string' })
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional( { message: 'Address must be a string' })
  address: string;

  @ApiPropertyOptional()
  @IsLatitude()
  @IsOptional( { message: 'Latitude must be a valid latitude' })
  loc_lat: number;

  @ApiPropertyOptional()
  @IsLongitude()
  @IsOptional( { message: 'Longitude must be a valid longitude' })
  loc_long: number;

  @ApiPropertyOptional()
  @IsUUID( 'all', { message: 'Subscription ID must be a valid UUID' })
  @IsOptional()
  subscription_id: string;

  @ApiPropertyOptional()
  @IsPositive({ message: 'Value must be positive' })
  @IsInt({ message: 'Value must be an integer' })
  @IsOptional()
  max_employee: number;

  @ApiPropertyOptional({
    example:
      '1970-01-01T08:57:24.123Z or 1970-01-01T08:57:24.123+07:00. Z for UTC +0 Zulu and +7 for Indonesia',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|[+-]\d{2}:\d{2})$/, {
    message: 'Timestamp must be in ISO 8601 format (with Z or timezone offset)',
  })
  @IsOptional()
  subs_date_start;

  @ApiPropertyOptional({
    example:
      '1970-01-01T08:57:24.123Z or 1970-01-01T08:57:24.123+07:00. Z for UTC +0 Zulu and +7 for Indonesia',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|[+-]\d{2}:\d{2})$/, {
    message: 'Timestamp must be in ISO 8601 format (with Z or timezone offset)',
  })
  @IsOptional()
  subs_date_end;

  @ApiPropertyOptional()
  @IsEnum(CompanySubscriptionStatus, { message: 'Invalid status' })
  @IsOptional()
  status: CompanySubscriptionStatus;
}
