import { Type } from 'class-transformer';
import { IsArray, IsString, IsUUID, MinLength } from 'class-validator';
import { Question } from 'src/course/question/entities/question.entity';

export class CreateQuizDto {
  @IsString()
  @MinLength(1)
  name: string;
  @IsString()
  @IsUUID()
  @MinLength(1)
  courseId: string;
  @IsArray()
  @Type(() => Question)
  questions: Question[];
}
