import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { AuthModule } from 'src/auth/auth.module';
import { Teacher } from './entities/teacher.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { Course } from 'src/course/course/entities/course.entity';

@Module({
  controllers: [TeachersController],
  providers: [TeachersService],
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([Teacher, Course])
  ],
  exports: [TeachersService]
})
export class TeachersModule {}
