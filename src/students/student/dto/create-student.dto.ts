import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  MinLength,
} from 'class-validator';

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
  @IsString()
  @IsUUID()
  courseId: string;
}
export class CreateGradeDto {
  @IsString()
  @IsUUID()
  studentId: string;
  @IsString()
  @IsUUID()
  quizId: string;
  @IsNumber()
  @Min(0)
  @Max(10)
  grade: number;
}
