import { IsDate, IsNotEmpty, IsNumber, IsUUID } from '@nestjs/class-validator';

export class editCheckClockDto {
  @IsUUID()
  @IsNotEmpty()
  employee_id: string;

  @IsNumber()
  @IsNotEmpty()
  check_clock_type: number;

  @IsDate()
  @IsNotEmpty()
  check_clock_time: Date;
}
