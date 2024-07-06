import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './entities';
import { CourseModule } from '../course/course.module';
import { CommonModule } from 'src/common/common.module';
import { Question } from '../question/entities/question.entity';
import { Answer } from '../answer/entities/answer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, Question, Answer]),
    CourseModule,
    CommonModule,
  ],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}
