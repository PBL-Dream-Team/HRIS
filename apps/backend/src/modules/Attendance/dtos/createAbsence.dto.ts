import {
  IsDate,
  IsEnum,
  IsISBN,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from '@nestjs/class-validator';
import { leavestatus } from './leavestatus.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbsentType } from './absencetype.enum';

export class createAbsenceDto {
  @ApiProperty()
  @IsUUID(undefined, { message: 'employee_id must be a valid UUID' })
  @IsNotEmpty({ message: 'employee_id is required' })
  employee_id: string;

  @ApiProperty()
  @IsUUID(undefined, { message: 'company_id must be a valid UUID' })
  @IsNotEmpty({ message: 'company_id is required' })
  company_id: string;

  @ApiProperty()
  @IsEnum(AbsentType, { message: 'type must be a valid AbsentType' })
  @IsNotEmpty({ message: 'type is required' })
  type: AbsentType;

  @ApiPropertyOptional()
  @IsString({ message: 'reason must be a string' })
  @IsOptional()
  reason: string;

  @ApiPropertyOptional({
    example:
      '1970-01-01T08:57:24.123Z or 1970-01-01T08:57:24.123+07:00. Z for UTC +0 Zulu and +7 for Indonesia',
  })
  @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}(Z|[+-][0-9]{2}:[0-9]{2})$/, {
    message: 'date must be in ISO 8601 format (with Z or timezone offset)',
  })
  @IsOptional()
  date;

  @ApiPropertyOptional()
  @IsEnum(leavestatus, { message: 'status must be a valid status' })
  @IsOptional()
  status: leavestatus;

  @ApiPropertyOptional({
    example:
      '1970-01-01T08:57:24.123Z or 1970-01-01T08:57:24.123+07:00. Z for UTC +0 Zulu and +7 for Indonesia',
  })
  @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}(Z|[+-][0-9]{2}:[0-9]{2})$/, {
    message: 'status_change_at must be in ISO 8601 format (with Z or timezone offset)',
  })
  @IsOptional()
  status_change_at;
}
