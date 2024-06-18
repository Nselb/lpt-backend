import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../student/entities/student.entity';
import { StudentModule } from '../student/student.module';
import { Progress } from './entities/progress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Progress]), StudentModule],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule {}
