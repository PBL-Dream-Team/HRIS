import {
  IsBoolean,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from '@nestjs/class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { workscheme } from './workscheme.enum';

export class editAttendanceTypeDto {
  @ApiPropertyOptional()
  @IsUUID(undefined, { message: 'company_id must be a valid UUID' })
  @IsOptional()
  company_id: string;

  @ApiPropertyOptional()
  @IsString({ message: 'name must be a string' })
  @IsOptional()
  name: string;

  @ApiPropertyOptional({
    example:
      '1970-01-01T08:57:24.123Z or 1970-01-01T08:57:24.123+07:00. Z for UTC +0 Zulu and +7 for Indonesia',
  })
  @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}(Z|[+-][0-9]{2}:[0-9]{2})$/, {
    message: 'check_in must be in ISO 8601 format (with Z or timezone offset)',
  })
  @IsNotEmpty({ message: 'check_in is required' })
  check_in: Date;

  @ApiPropertyOptional({
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

  @ApiPropertyOptional()
  @IsString({ message: 'workspace_address must be a string' })
  @IsOptional()
  workspace_address: string;

  @ApiPropertyOptional()
  @IsLatitude({ message: 'workspace_lat must be a valid latitude' })
  @IsOptional()
  workspace_lat: number;

  @ApiPropertyOptional()
  @IsLongitude({ message: 'workspace_long must be a valid longitude' })
  @IsOptional()
  workspace_long: number;

  @ApiPropertyOptional()
  @IsBoolean({ message: 'is_deleted must be a boolean' })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  is_deleted: boolean;
}
