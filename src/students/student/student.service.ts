import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGradeDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { CommonService } from 'src/common/common.service';
import { CourseService } from '../../course/course/course.service';
import { StudentGrade } from './entities/student-grade.entity';
import { Quiz } from 'src/course/quiz/entities';
import { QuizService } from '../../course/quiz/quiz.service';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(StudentGrade)
    private readonly studentGradeRepository: Repository<StudentGrade>,
    private readonly quizService: QuizService,
    private readonly commonService: CommonService,
    private readonly courseService: CourseService,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    console.log(limit);
    let students = await this.studentRepository.find({
      take: limit,
      skip: offset,
      relations: ['course'],
    });
    return students;
  }

  async findOne(term: string) {
    let student: Student;
    student = await this.studentRepository.findOne({
      where: { id: term },
      relations: ['course', 'studentGrades'],
    });
    if (!student) {
      student = await this.studentRepository.findOne({
        where: { username: term },
        relations: ['course', 'studentGrades'],
      });
    }
    if (!student)
      throw new NotFoundException(`Student with term ${term} not found`);
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const { courseId } = updateStudentDto;
    const student = await this.studentRepository.preload({
      id: id,
      ...updateStudentDto,
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (courseId) {
        const course = await this.courseService.findOne(courseId);
        if (!course) {
          throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
        student.course = course;
      }
      await this.studentRepository.save(student);
      await queryRunner.commitTransaction();
      return this.studentRepository.findOne({
        where: { id: student.id },
        relations: ['course', 'studentGrade'],
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.commonService.handleDBErrors(error);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    const student = await this.findOne(id);
    await this.studentRepository.remove(student);
    return `Deleted Successfully`;
  }

  async gradeQuiz(createGradeDto: CreateGradeDto) {
    const { studentId, quizId } = createGradeDto;
    const quiz = await this.quizService.findOne(quizId);
    if (!quiz) {
      throw new BadRequestException('Quiz no existe');
    }
    const student = await this.findOne(studentId);
    if (!student) {
      throw new BadRequestException('Estudiante no existe');
    }
    const createdGrade = this.studentGradeRepository.create({
      ...createGradeDto,
      quiz,
      student,
    });
    return await this.studentGradeRepository.save(createdGrade);
  }

  async getStudentGradesByQuiz(studentId: string, quizId: string) {
    const quiz = await this.quizService.findOne(quizId);
    if (!quiz) {
      throw new BadRequestException('Quiz no existe');
    }
    const student = await this.findOne(studentId);
    if (!student) {
      throw new BadRequestException('Estudiante no existe');
    }
    const studentGrade = await this.studentGradeRepository.findOne({
      where: { quiz, student },
    });
    if (!studentGrade) {
      return '-';
    } else {
      return studentGrade.grade;
    }
  }
}
