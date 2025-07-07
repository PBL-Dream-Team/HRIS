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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { workscheme } from './workscheme.enum';

export class createAttendanceTypeDto {
  @ApiProperty()
  @IsUUID(undefined, { message: 'company_id must be a valid UUID' })
  @IsNotEmpty({ message: 'company_id is required' })
  company_id: string;

  @ApiProperty()
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @ApiProperty({
    example:
      '1970-01-01T08:57:24.123Z or 1970-01-01T08:57:24.123+07:00. Z for UTC +0 Zulu and +7 for Indonesia',
  })
  @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}(Z|[+-][0-9]{2}:[0-9]{2})$/, {
    message: 'check_in must be in ISO 8601 format (with Z or timezone offset)',
  })
  @IsNotEmpty({ message: 'check_in is required' })
  check_in: Date;

  @ApiProperty({
    example:
      '1970-01-01T08:57:24.123Z or 1970-01-01T08:57:24.123+07:00. Z for UTC +0 Zulu and +7 for Indonesia',
  })
  @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}(Z|[+-][0-9]{2}:[0-9]{2})$/, {
    message: 'check_out must be in ISO 8601 format (with Z or timezone offset)',
  })
  @IsNotEmpty({ message: 'check_out is required' })
  check_out: Date;

  @ApiPropertyOptional()
  @IsEnum(workscheme, { message: 'workscheme must be a valid workscheme' })
  @IsOptional()
  workscheme: workscheme;

  @ApiProperty()
  @IsString({ message: 'workspace_address must be a string' })
  @IsNotEmpty({ message: 'workspace_address is required' })
  workspace_address: string;

  @ApiProperty()
  @IsLatitude({ message: 'workspace_lat must be a valid latitude' })
  @IsNotEmpty({ message: 'workspace_lat is required' })
  workspace_lat: number;

  @ApiProperty()
  @IsLongitude({ message: 'workspace_long must be a valid longitude' })
  @IsNotEmpty({ message: 'workspace_long is required' })
  workspace_long: number;
}
