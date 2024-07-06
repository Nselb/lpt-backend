import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto';
import { IsString, IsUUID } from 'class-validator';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {}
