import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateLetterDto {
  @IsNotEmpty()
  @IsUUID()
  letter_format_id: string;

  @IsNotEmpty()
  @IsUUID()
  employee_id: string;

  @IsNotEmpty()
  name: string;
}
