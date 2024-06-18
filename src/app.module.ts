import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TeachersModule } from './teachers/teachers.module';
import { CommonModule } from './common/common.module';
import { CourseModule } from './course/course/course.module';
import { QuizModule } from './course/quiz/quiz.module';
import { QuestionModule } from './course/question/question.module';
import { AnswerModule } from './course/answer/answer.module';
import { StudentModule } from './students/student/student.module';
import { ProgressModule } from './students/progress/progress.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    TeachersModule,
    CommonModule,
    CourseModule,
    QuizModule,
    QuestionModule,
    AnswerModule,
    StudentModule,
    ProgressModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
