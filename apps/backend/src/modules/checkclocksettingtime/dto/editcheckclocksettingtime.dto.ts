import { IsDate, IsNotEmpty, IsUUID } from 'class-validator';

export class editCheckClockSettingTimeDto {
  @IsUUID()
  @IsNotEmpty()
  ck_setting_id: string;

  @IsDate()
  @IsNotEmpty()
  day: Date;

  @IsDate()
  @IsNotEmpty()
  clock_in: Date;

  @IsDate()
  @IsNotEmpty()
  clock_out: Date;

  @IsDate()
  @IsNotEmpty()
  break_start: Date;

  @IsDate()
  @IsNotEmpty()
  break_end: Date;
}
