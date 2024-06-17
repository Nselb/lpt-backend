import { Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Injectable()
export class AnswerService {
  async create(createAnswerDto: CreateAnswerDto) {
    return 'This action adds a new answer';
  }

  async findAllByQuestion(questionId: string) {
    return `This action returns a #${questionId} answer`;
  }

  async update(id: string, updateAnswerDto: UpdateAnswerDto) {
    return `This action updates a #${id} answer`;
  }

  async remove(id: string) {
    return `This action removes a #${id} answer`;
  }
}
