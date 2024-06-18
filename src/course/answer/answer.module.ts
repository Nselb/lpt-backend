import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { QuestionModule } from '../question/question.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Answer]), QuestionModule, CommonModule],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AnswerModule {}
