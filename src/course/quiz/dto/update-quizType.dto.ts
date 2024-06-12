import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizTypeDto } from './create-quizType.dto';

export class UpdateQuizTypeDto extends PartialType(CreateQuizTypeDto) {}