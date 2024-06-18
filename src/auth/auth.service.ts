import { DataSource, Repository } from 'typeorm';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { hashPassword, verifyPassword } from '../plugins/crypt';
import { JwtStudentPayload } from './dto/intrefaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { CreateTeacherDto } from 'src/teachers/dto/create-teacher.dto';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { CommonService } from 'src/common/common.service';
import { TeacherLoginDto } from './dto/login/teacher-login.dto';
import { Student } from 'src/students/student/entities/student.entity';
import { CreateStudentDto } from 'src/students/student/dto/create-student.dto';
import { StudentLoginDto } from './dto';
import { Progress } from 'src/students/progress/entities/progress.entity';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(Progress)
    private readonly progressRepository: Repository<Progress>,
    private readonly jwtService: JwtService,
    private readonly commonService: CommonService,
    private readonly dataSource: DataSource,
  ) {}
  async registerTeacher(teacherDto: CreateTeacherDto) {
    try {
      const { password, ...teacherData } = teacherDto;
      const teacher = this.teacherRepository.create({
        ...teacherData,
        password: hashPassword(password, 10),
      });
      const createdteacher = await this.teacherRepository.save(teacher);
      return {
        ...createdteacher,
        token: this.getJwt({ id: createdteacher.id }),
      };
    } catch (error) {
      this.commonService.handleDBErrors(error);
    }
  }
  async registerStudent(studentDto: CreateStudentDto) {
    const { pin, ...studentData } = studentDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const student = this.studentRepository.create({
        ...studentData,
        pin: hashPassword(pin.toString(), 10),
      });
      const createdStudent = await this.studentRepository.save(student);
      delete createdStudent.pin;
      const progress = this.progressRepository.create({
        id: student.id,
        student: createdStudent,
      });
      await this.progressRepository.save(progress);
      await queryRunner.commitTransaction()
      return {
        ...createdStudent,
        token: this.getJwt({ id: createdStudent.id }),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction()
      this.commonService.handleDBErrors(error)
    }finally{
      queryRunner.release()
    }
  }

  async studentLogin(studentLoginDto: StudentLoginDto) {
    const { pin, username } = studentLoginDto;
    const student = await this.studentRepository.findOne({
      where: { username },
      select: { username: true, pin: true, id: true },
    });
    if (!student) {
      throw new UnauthorizedException('Usuario o contraseña inválidos');
    }
    if (!verifyPassword(pin.toString(), student.pin)) {
      throw new UnauthorizedException('Usuario o contraseña inválidos');
    }
    return {
      username: student.username,
      token: this.getJwt({ id: student.id }),
    };
  }

  async teacherLogin(teacherLoginDto: TeacherLoginDto) {
    const { password, username } = teacherLoginDto;
    console.log(password, username);
    const teacher = await this.teacherRepository.findOne({
      where: { username },
      select: { username: true, password: true, id: true },
    });
    if (!teacher) {
      throw new UnauthorizedException('Usuario o contraseña inválidos');
    }
    if (!verifyPassword(password.toString(), teacher.password)) {
      throw new UnauthorizedException('Usuario o contraseña inválidos');
    }
    return {
      username: teacher.username,
      token: this.getJwt({ id: teacher.id }),
    };
  }

  private getJwt(payload: JwtStudentPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
