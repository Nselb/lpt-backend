import { Type } from 'class-transformer';
import { IsArray, IsString, IsUUID, MinLength } from 'class-validator';
import { Answer } from 'src/course/answer/entities/answer.entity';

export class CreateQuestionDto {
  @IsString()
  @MinLength(1)
  text: string;
  @IsString()
  @IsUUID()
  quizId: string;
  @IsArray()
  @Type(() => Answer)
  answers: Answer[];
}
