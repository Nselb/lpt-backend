import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuizDto, UpdateQuizDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz, QuizType } from './entities';
import { DataSource, Repository } from 'typeorm';
import { CourseService } from '../course/course.service';
import { CommonService } from 'src/common/common.service';
import { QuestionService } from '../question/question.service';
import { Question } from '../question/entities/question.entity';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(QuizType)
    private readonly quizTypeRepository: Repository<QuizType>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    private readonly courseService: CourseService,
    private readonly commonService: CommonService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createQuizDto: CreateQuizDto) {
    const { name, courseId, quizTypeId, questions } = createQuizDto;

    return this.dataSource.transaction(async (manager) => {
      const course = await this.courseService.findOne(courseId);

      if (!course)
        throw new NotFoundException(`Teacher with id ${courseId} not found`);

      const quizType = await this.quizTypeRepository.findOneBy({
        id: quizTypeId,
      });

      if (!quizTypeId)
        throw new NotFoundException(
          `QuizType with id ${quizTypeId} not found.`,
        );

      let quiz = this.quizRepository.create({
        ...createQuizDto,
      });
      quiz.course = course;
      quiz.quizType = quizType;

      await manager.save(quiz);
      
      for (const questionDto of questions) {
        const existingQuestion = await this.questionRepository.findOne({
          where: { text: questionDto.text, quiz: { id: quiz.id } },
        });

        if (!existingQuestion) {
          const newQuestion = this.questionRepository.create({
            text: questionDto.text,
            quiz,
          });
          await manager.save(newQuestion);
        }
      }

      return this.quizRepository.findOne({
        where: { id: quiz.id },
        relations: ['questions'],
      });
    });
  }

  async findAll() {
    return await this.quizRepository.find({ relations: ['questions'] });
  }

  async findOne(term: string) {
    let quiz: Quiz;
    quiz = await this.quizRepository.findOneBy({ id: term });
    if (!quiz) {
      quiz = await this.quizRepository.findOneBy({ name: term });
    }

    if (!quiz) throw new NotFoundException(`Quiz with term ${term} not found`);

    return this.quizRepository.findOne({
      where: { id: quiz.id },
      relations: ['questions'],
    });
  }

  async update(id: string, updateQuizDto: UpdateQuizDto) {
    const { name, courseId, quizTypeId, questions } = updateQuizDto;
    let quiz = await this.quizRepository.findOneBy({ id });

    if (!quiz) throw new NotFoundException(`Quiz With id ${id} not found`);
    return this.dataSource.transaction(async (manager) => {
      if (name) {
        quiz.name = name;
      }

      if (courseId) {
        const course = await this.courseService.findOne(courseId);
        quiz.course = course;
      }
      if (quizTypeId) {
        const quizType = await this.quizTypeRepository.findOneBy({
          id: quizTypeId,
        });
        quiz.quizType = quizType;
      }
      await manager.save(quiz)
      if (questions.length != 0) {
        for (const question of questions) {
          const existingQuestion = await this.questionRepository.findOne({
            where: { text: question.text, quiz: { id: quiz.id } },
          });
          if (!existingQuestion) {
            const newQuestion = this.questionRepository.create({
              text: question.text,
              quiz,
            });
            await manager.save(newQuestion);
          }
        }
      }
      return this.quizRepository.findOne({
        where: { id: quiz.id },
        relations: ['questions'],
      });
      
    });
  }

  async remove(id: string) {
    const quiz = await this.findOne(id);

    await this.quizRepository.remove(quiz);

    return `Deleted Successfully`;
  }
}
