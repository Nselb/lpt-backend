import { IsString, IsUUID, MinLength } from "class-validator";

export class CreateQuestionDto {

    @IsString()
    @MinLength(1)
    text: string;

    @IsString()
    @IsUUID()
    quizId: string;

}
