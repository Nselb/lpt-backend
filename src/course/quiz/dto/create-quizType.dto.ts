import { IsString, IsUUID, MinLength } from "class-validator";

export class CreateQuizTypeDto {

    @IsString()
    @MinLength(1)
    name: string;

}
