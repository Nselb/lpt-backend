import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { CourseModule } from 'src/course/course/course.module';
import { CommonModule } from '../../common/common.module';
import { QuizModule } from 'src/course/quiz/quiz.module';
import { StudentGrade } from './entities/student-grade.entity';
import { Progress } from '../progress/entities/progress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, StudentGrade, Progress]), CourseModule, CommonModule, QuizModule],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService]
})
export class StudentModule {}
