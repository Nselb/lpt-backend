import { IsInt, IsString } from 'class-validator';

export class StudentLoginDto {
  @IsString()
  username: string;
  @IsInt()
  pin: number;
}
