import { IsString, Matches, MinLength } from 'class-validator';

export class CreateTeacherDto {
  @IsString()
  @MinLength(1)
  firstName: string;
  @IsString()
  @MinLength(1)
  lastName: string;
  @IsString()
  @MinLength(1)
  username: string;
  @IsString()
  @MinLength(1)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;
}
