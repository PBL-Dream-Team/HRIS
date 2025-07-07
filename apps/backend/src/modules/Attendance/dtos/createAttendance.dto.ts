import {
  IsDate,
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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { attendanceapproval } from './attendanceapproval.enum';

export class createAttendanceDto {
  @ApiProperty()
  @IsUUID(undefined, { message: 'company_id must be a valid UUID' })
  @IsNotEmpty({ message: 'company_id is required' })
  company_id: string;

  @ApiProperty()
  @IsUUID(undefined, { message: 'employee_id must be a valid UUID' })
  @IsNotEmpty({ message: 'employee_id is required' })
  employee_id: string;

  @ApiProperty()
  @IsUUID(undefined, { message: 'type_id must be a valid UUID' })
  @IsNotEmpty({ message: 'type_id is required' })
  type_id: string;

  @ApiProperty({
    example:
      '1970-01-01T08:57:24.123Z or 1970-01-01T08:57:24.123+07:00. Z for UTC +0 Zulu and +7 for Indonesia',
  })
  @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}(Z|[+-][0-9]{2}:[0-9]{2})$/, {
    message: 'check_in must be in ISO 8601 format (with Z or timezone offset)',
  })
  @IsNotEmpty({ message: 'check_in is required' })
  check_in: Date;

  @ApiProperty()
  @IsString({ message: 'check_in_address must be a string' })
  @IsNotEmpty({ message: 'check_in_address is required' })
  check_in_address: string;

  @ApiProperty()
  @IsLatitude({ message: 'check_in_lat must be a valid latitude' })
  @IsNotEmpty({ message: 'check_in_lat is required' })
  check_in_lat: number;

  @ApiProperty()
  @IsLongitude({ message: 'check_in_long must be a valid longitude' })
  @IsNotEmpty({ message: 'check_in_long is required' })
  check_in_long: number;

  @ApiProperty({
    example:
      '1970-01-01T08:57:24.123Z or 1970-01-01T08:57:24.123+07:00. Z for UTC +0 Zulu and +7 for Indonesia',
  })
  @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}(Z|[+-][0-9]{2}:[0-9]{2})$/, {
    message: 'check_out must be in ISO 8601 format (with Z or timezone offset)',
  })
  @IsOptional()
  check_out: Date;

  @ApiProperty()
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
