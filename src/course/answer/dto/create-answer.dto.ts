import { IsBoolean, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  @MinLength(1)
  text: string;
  @IsBoolean()
  isCorrect: boolean;
  @IsUUID()
  questionId: string;
}
