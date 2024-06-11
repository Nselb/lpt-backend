import { IsInt, IsString, Max, Min, MinLength } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @MinLength(1)
  firstName: string;
  @IsString()
  @MinLength(1)
  lastName: string;
  @IsString()
  @MinLength(1)
  username: string;
  @IsInt()
  @Min(1)
  @Max(9999)
  pin: string;
}
