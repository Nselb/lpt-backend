import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { CommonService } from 'src/common/common.service';
import { CourseService } from '../../course/course/course.service';
import { QuizService } from '../../course/quiz/quiz.service';
import { StudentGrade } from './entities/student-grade.entity';

@Injectable()
export class StudentService {

  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(StudentGrade)
    private readonly studentGradeRepository: Repository<StudentGrade>,
    private readonly commonService: CommonService,
    private readonly courseService: CourseService,
    private readonly quizService: QuizService,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { limit=10, offset =0 } = paginationDto;
    console.log(limit)
    let students = await this.studentRepository.find({
      take: limit,
      skip: offset,
      relations: ['course']
    });
    return students;
  }

  async findOne(term: string) {
    let student: Student;
    student = await this.studentRepository.findOne({ where: {id: term}, relations: ['course', 'studentGrades'] });
    if(!student){
      student = await this.studentRepository.findOne({where: { username: term }, relations: ['course', 'studentGrades']});
    }

    if(!student) throw new NotFoundException(`Student with term ${term} not found`);

    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const { courseId, quizId, grades } = updateStudentDto;

    const student = await this.studentRepository.preload({
      id: id,
      ...updateStudentDto
    })
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      if (courseId) {
        const course = await this.courseService.findOne(courseId);
        if (!course) {
          throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
        student.course = course;
      }
  
      if (grades) {
        for (const grade of grades) {
          
          const quiz = await this.quizService.findOne(grade.quizId);
          if (!quiz) {
            throw new NotFoundException(`Quiz with ID ${quizId} not found`);
          }
  
          // Check if the student already has a grade for this quiz
          const existingGrade = student.studentGrades.find(studentGrade => studentGrade.quiz.id === quizId);
          if (!existingGrade) {
            const gradeStudent = grade.grade
            const studentGrade = this.studentGradeRepository.create({
              grade: grade.grade,
              quiz,
              student,
              date: new Date().toDateString()
            });
            await this.studentGradeRepository.save(studentGrade);
          } else {
            existingGrade.grade = grade.grade;
            await this.studentGradeRepository.save(existingGrade);
          }
        }
      }
      await this.studentRepository.save(student);
      await queryRunner.commitTransaction()
      return this.studentRepository.findOne({
        where: {id: student.id},
        relations: ['course', 'studentGrade']
      })
    } catch (error) {
      await queryRunner.rollbackTransaction()
      this.commonService.handleDBErrors(error);
    } finally{
      await queryRunner.release()
    }
  }

  async remove(id: string) {
    const student = await this.findOne(id);
    
    await this.studentRepository.remove(student);

    return `Deleted Successfully`;
  }
}
