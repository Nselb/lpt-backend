import { Type } from "class-transformer";
import { IsArray, IsString, IsUUID, MinLength, ValidateNested } from "class-validator";
import { CreateQuestionDto } from "src/course/question/dto/create-question.dto";

export class CreateQuizDto {

    @IsString()
    @MinLength(1)
    name: string;
    @IsString()
    @IsUUID()
    @MinLength(1)
    courseId: string;
    @IsString()
    @IsUUID()
    @MinLength(1)
    quizTypeId: string;

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => CreateQuestionDto)
    questions: CreateQuestionDto[]
}
