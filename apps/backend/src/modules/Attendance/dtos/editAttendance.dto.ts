import {
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from '@nestjs/class-validator';
import { checkinstatus } from './checkinstatus.enum';
import { checkoutstatus } from './checkoutstatus.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { attendanceapproval } from './attendanceapproval.enum';

export class editAttendanceDto {
  @ApiPropertyOptional()
  @IsUUID(undefined, { message: 'company_id must be a valid UUID' })
  @IsOptional()
  company_id: string;

  @ApiPropertyOptional()
  @IsUUID(undefined, { message: 'employee_id must be a valid UUID' })
  @IsOptional()
  employee_id: string;

  @ApiPropertyOptional()
  @IsUUID(undefined, { message: 'type_id must be a valid UUID' })
  @IsOptional()
  type_id: string;

  @ApiPropertyOptional({
    example:
      '1970-01-01T08:57:24.123Z or 1970-01-01T08:57:24.123+07:00. Z for UTC +0 Zulu and +7 for Indonesia',
  })
  @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}(Z|[+-][0-9]{2}:[0-9]{2})$/, {
    message: 'check_in must be in ISO 8601 format (with Z or timezone offset)',
  })
  @IsOptional()
  check_in: Date;

  @ApiPropertyOptional()
  @IsString({ message: 'check_in_address must be a string' })
  @IsOptional()
  check_in_address: string;

  @ApiPropertyOptional()
  @IsLatitude({ message: 'check_in_lat must be a valid latitude' })
  @IsOptional()
  check_in_lat: number;

  @ApiPropertyOptional()
  @IsLongitude({ message: 'check_in_long must be a valid longitude' })
  @IsOptional()
  check_in_long: number;

  @ApiPropertyOptional({
    example:
      '1970-01-01T08:57:24.123Z or 1970-01-01T08:57:24.123+07:00. Z for UTC +0 Zulu and +7 for Indonesia',
  })
  @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}(Z|[+-][0-9]{2}:[0-9]{2})$/, {
    message: 'check_out must be in ISO 8601 format (with Z or timezone offset)',
  })
  @IsOptional()
  check_out: string;

  @ApiPropertyOptional()
  @IsString({ message: 'check_out_address must be a string' })
  @IsOptional()
  check_out_address: string;

  @ApiPropertyOptional()
  @IsLatitude({ message: 'check_out_lat must be a valid latitude' })
  @IsOptional()
  check_out_lat: number;

  @ApiPropertyOptional()
  @IsLongitude({ message: 'check_out_long must be a valid longitude' })
  @IsOptional()
  check_out_long: number;

  @ApiPropertyOptional()
  @IsEnum(attendanceapproval, { message: 'approval must be a valid approval' })
  @IsOptional()
  approval: string;
}
