import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Repository } from 'typeorm';
import { QuizService } from '../quiz/quiz.service';
import { CommonService } from '../../common/common.service';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    private readonly quizService: QuizService,
    private readonly commonService: CommonService,
  ) {}

  async create(createQuestionDto: CreateQuestionDto) {
    const { quizId } = createQuestionDto;

    const quiz = await this.quizService.findOne(quizId);

    if (!quiz) throw new NotFoundException(`Quiz with id ${quiz} not found`);

    try {
      let question = this.questionRepository.create({
        ...createQuestionDto,
      });
      question.quiz = quiz;

      await this.questionRepository.save(quiz);

      return quiz;
    } catch (error) {
      this.commonService.handleDBErrors(error);
    }
  }

  async findAll() {
    return await this.questionRepository.find({});
  }

  async findOne(id: string) {
    let question: Question;
    question = await this.questionRepository.findOneBy({ id });

    if (!question) throw new NotFoundException(`Quiz with id ${id} not found`);

    return question;
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto) {
    const { text, quizId } = updateQuestionDto;

    let question = await this.questionRepository.findOneBy({ id });

    if (!question)
      throw new NotFoundException(`Question With id ${id} not found`);

    if (text) {
      question.text = text;
    }

    if (quizId) {
      const quiz = await this.quizService.findOne(quizId);
      question.quiz = quiz;
    }

    try {
      await this.questionRepository.save(question);
      return question;
    } catch (error) {
      this.commonService.handleDBErrors(error);
    }
  }

  async remove(id: string) {
    const question = await this.findOne(id);

    await this.questionRepository.remove(question);

    return `Deleted Successfully`;
  }
}
