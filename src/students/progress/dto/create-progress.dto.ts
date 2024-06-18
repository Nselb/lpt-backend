import { IsBoolean, IsOptional, IsString, IsUUID } from "class-validator";
import { ToBoolean } from "../transformers/boolean.transformer";

export class CreateProgressDto {

    @IsOptional()
    @ToBoolean()
    @IsBoolean()
    abstractionTheory!: boolean
    @IsOptional()
    @ToBoolean()
    @IsBoolean()
    encapsulationTheory!: boolean
    @IsOptional()
    @ToBoolean()
    @IsBoolean()
    inheritanceTheory!: boolean;
    @IsOptional()
    @ToBoolean()
    @IsBoolean()
    polymorphismTheory!: boolean
    @IsOptional()
    @ToBoolean()
    @IsBoolean()
    abstractionGame!: boolean
    @IsOptional()
    @ToBoolean()
    @IsBoolean()
    inheritanceGame!: boolean
    @IsOptional()
    @ToBoolean()
    @IsBoolean()
    polymorphismGame!: boolean
    @IsOptional()
    @ToBoolean()
    @IsBoolean()
    encapsulationGame!: boolean
    @IsOptional()
    @ToBoolean()
    @IsBoolean()
    abstractionExcercise!: boolean
    @IsOptional()
    @ToBoolean()
    @IsBoolean()
    encapsulationExcercise!: boolean
    @IsOptional()
    @ToBoolean()
    @IsBoolean()
    inheritanceExcercise!: boolean
    @IsOptional()
    @ToBoolean()
    @IsBoolean()
    polymorphismExcercise!: boolean
    @IsString()
    @IsUUID()
    @IsOptional()
    studentId!: string

}
