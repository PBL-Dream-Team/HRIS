import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from '@nestjs/class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class editAttendanceTypeDto {
  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  company_id: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({
    example:
      '1970-01-01T08:57:24.123Z or 1970-01-01T08:57:24.123+07:00. Z for UTC +0 Zulu and +7 for Indonesia',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|[+-]\d{2}:\d{2})$/, {
    message: 'Timestamp must be in ISO 8601 format (with Z or timezone offset)',
  })
  @IsNotEmpty()
  check_in: Date;

  @ApiPropertyOptional({
    example:
      '1970-01-01T08:57:24.123Z or 1970-01-01T08:57:24.123+07:00. Z for UTC +0 Zulu and +7 for Indonesia',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|[+-]\d{2}:\d{2})$/, {
    message: 'Timestamp must be in ISO 8601 format (with Z or timezone offset)',
  })
  @IsNotEmpty()
  check_out: Date;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  workspace_address: string;

  @ApiPropertyOptional()
  @IsLatitude()
  @IsOptional()
  workspace_lat: number;

  @ApiPropertyOptional()
  @IsLongitude()
  @IsOptional()
  workspace_long: number;
}
