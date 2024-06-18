import { Repository } from 'typeorm';

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
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    private readonly jwtService: JwtService,
    private readonly commonService: CommonService,
  ) {}
  async registerTeacher(teacherDto: CreateTeacherDto) {
    try {
      const { password, ...teacherData } = teacherDto;
      const teacher = this.teacherRepository.create({
        ...teacherData,
        password: hashPassword(password, 10),
      });
      return await this.teacherRepository.save(teacher);
    } catch (error) {
      this.commonService.handleDBErrors(error);
    }
  }
  async registerStudent(studentDto: CreateStudentDto) {
    try {
      const { pin, ...studentData } = studentDto;
      const student = this.studentRepository.create({
        ...studentData,
        pin: hashPassword(pin.toString(), 10),
      });
      const createdStudent = await this.studentRepository.save(student);
      delete createdStudent.pin;
      return {
        ...createdStudent,
        token: this.getJwt({ id: createdStudent.id }),
      };
    } catch (error) {
      this.commonService.handleDBErrors(error);
    }
  }

  async studentLogin(studentLoginDto: StudentLoginDto) {
    const { pin, username } = studentLoginDto;
    const student = await this.studentRepository.findOne({
      where: { username },
      select: { username: true, pin: true },
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
      select: { username: true, password: true },
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
