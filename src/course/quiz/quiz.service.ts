import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuizDto, UpdateQuizDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from './entities';
import { DataSource, Repository } from 'typeorm';
import { CourseService } from '../course/course.service';
import { CommonService } from 'src/common/common.service';
import { Question } from '../question/entities/question.entity';
import { Answer } from '../answer/entities/answer.entity';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    private readonly courseService: CourseService,
    private readonly commonService: CommonService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createQuizDto: CreateQuizDto) {
    const { name, courseId, questions } = createQuizDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const course = await this.courseService.findOne(courseId);
      if (!course)
        throw new NotFoundException(`Course with id ${courseId} not found`);
      const existingQuiz = await this.quizRepository.findOne({
        where: { name, course },
      });
      if (existingQuiz)
        throw new BadRequestException(
          `Quiz with name ${name} already exists on course with ID ${courseId}`,
        );
      let quiz = this.quizRepository.create({
        name: name,
        questions: createQuizDto.questions,
      });
      quiz.course = course;
      await queryRunner.manager.save(quiz);
      for (const question of questions) {
        const newQuestion = this.questionRepository.create({
          text: question.text,
          quiz,
          answers: [],
        });
        await queryRunner.manager.save(newQuestion);
        for (const answer of question.answers) {
          const newAnswer = this.answerRepository.create({
            isCorrect: answer.isCorrect,
            question: newQuestion,
            text: answer.text,
          });
          await queryRunner.manager.save(newAnswer);
        }
      }
      await queryRunner.commitTransaction();

      return await this.quizRepository.findOne({
        where: { id: quiz.id },
        relations: ['questions', 'course', 'questions.answers'],
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.commonService.handleDBErrors(error);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.quizRepository.find({
      relations: ['questions', 'course', 'questions.answers'],
    });
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
      relations: ['questions', 'course', 'questions.answers'],
    });
  }

  async findByCourse(term: string) {
    const course = await this.courseService.findOne(term);
    if (!course) {
      throw new BadRequestException(`No se encontro curso con id ${term}`);
    }
    const quizes = await this.quizRepository.findBy({ course });
    if (!quizes) {
      throw new BadRequestException('No hay quizes con ese curso');
    }
    return quizes;
  }

  async update(id: string, updateQuizDto: UpdateQuizDto) {
    const { name, courseId, questions } = updateQuizDto;
    let quiz = await this.quizRepository.findOneBy({ id });
    if (!quiz) throw new NotFoundException(`Quiz With id ${id} not found`);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (name) {
        quiz.name = name;
      }
      if (courseId) {
        const course = await this.courseService.findOne(courseId);
        quiz.course = course;
        const existingQuiz = await this.quizRepository.findOne({
          where: { name, course },
        });
        if (existingQuiz)
          throw new BadRequestException(
            `Quiz with name ${name} already exists on course with ID ${courseId}`,
          );
      }
      await queryRunner.manager.save(quiz);
      if (questions.length != 0) {
        await queryRunner.manager.delete(Question, { quiz: { id: quiz.id } });
        for (const question of questions) {
          const newQuestion = this.questionRepository.create({
            text: question.text,
            quiz,
            answers: question.answers,
          });
          await queryRunner.manager.save(newQuestion);
        }
      }
      await queryRunner.commitTransaction();
      return this.quizRepository.findOne({
        where: { id: quiz.id },
        relations: ['questions', 'course'],
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.commonService.handleDBErrors(error);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    const quiz = await this.findOne(id);
    await this.quizRepository.remove(quiz);
    return `Deleted Successfully`;
  }
}
