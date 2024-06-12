import { IsString, IsUUID, MinLength } from "class-validator";

export class CreateCourseDto {

    @IsString()
    @MinLength(1)
    name: string;
    @IsString()
    @MinLength(1)
    @IsUUID()
    teacherId: string;

}
