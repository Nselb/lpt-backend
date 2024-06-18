import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class UpdateStudentGradeDto {
  @IsString()
  @IsNotEmpty()
  quizId: string;

  @IsString()
  @IsNotEmpty()
  grade: string;
}

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
  @IsString()
  @IsUUID()
  @IsOptional()
  courseId?: string;
  @IsString()
  @IsOptional()
  quizId?: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateStudentGradeDto)
  @IsOptional()
  grades?: UpdateStudentGradeDto[];
}
