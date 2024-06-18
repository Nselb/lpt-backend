import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { QuestionService } from '../question/question.service';
import { CommonService } from '../../common/common.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    private readonly questionService: QuestionService,
    private readonly commonService: CommonService,
  ) {}
  async create(createAnswerDto: CreateAnswerDto) {
    const { questionId } = createAnswerDto;
    const question = await this.questionService.findOne(questionId);
    if (!question)
      throw new NotFoundException(`Question with id ${questionId} not found`);
    try {
      const answer = this.answerRepository.create({
        ...createAnswerDto,
        question,
      });
      const savedAnswer = await this.answerRepository.save(answer);
      return savedAnswer;
    } catch (error) {
      this.commonService.handleDBErrors(error);
    }
  }

  async findAllByQuestion(questionId: string) {
    const question = await this.questionService.findOne(questionId);
    if (!question)
      throw new NotFoundException(`Question with id ${questionId} not found`);
    try {
      const answers = await this.answerRepository.find({
        where: { question },
      });
      return answers;
    } catch (error) {
      this.commonService.handleDBErrors(error);
    }
  }

  async update(id: string, updateAnswerDto: UpdateAnswerDto) {
    const { text, questionId } = updateAnswerDto;

    let answer = await this.answerRepository.findOneBy({ id });

    if (!answer) throw new NotFoundException(`Answer With id ${id} not found`);

    if (text) {
      answer.text = text;
    }

    if (questionId) {
      const question = await this.questionService.findOne(questionId);
      answer.question = question;
    }

    try {
      const savedAnswer = await this.answerRepository.save(answer);
      return savedAnswer;
    } catch (error) {
      this.commonService.handleDBErrors(error);
    }
  }

  async remove(id: string) {
    const answerToDelete = await this.answerRepository.findOneBy({ id });
    if (!answerToDelete) {
      throw new BadRequestException('No se encontró respuesta');
    }
    return await this.answerRepository.delete(answerToDelete);
  }
}
