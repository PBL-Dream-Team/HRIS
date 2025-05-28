import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  old_password: string;

  @IsString()
  @MinLength(8)
  new_password: string;
}
