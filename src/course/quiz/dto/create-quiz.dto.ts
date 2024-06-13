import { Type } from "class-transformer";
import { IsArray, IsString, IsUUID, MinLength, ValidateNested } from "class-validator";

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
    @Type(() => String)
    questions: string[]
}
