import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz, QuizType } from './entities';
import { CourseModule } from '../course/course.module';
import { CommonModule } from 'src/common/common.module';
import { QuestionModule } from '../question/question.module';
import { Question } from '../question/entities/question.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, QuizType, Question]),
    CourseModule,
    CommonModule,
  ],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService]
})
export class QuizModule {}
