import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { CourseModule } from 'src/course/course/course.module';
import { CommonModule } from '../../common/common.module';
import { QuizModule } from 'src/course/quiz/quiz.module';
import { StudentGrade } from './entities/student-grade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, StudentGrade]), CourseModule, CommonModule, QuizModule],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
