import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateStudentDto, StudentLoginDto } from './dto';
import { CreateTeacherDto } from 'src/teachers/dto/create-teacher.dto';
import { TeacherLoginDto } from './dto/login/teacher-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('createTeacher')
  createTeacher(@Body() teacherDto: CreateTeacherDto) {
    return this.authService.registerTeacher(teacherDto);
  }
  @Post('createStudent')
  createStudent(@Body() studentDto: CreateStudentDto) {
    return this.authService.registerStudent(studentDto);
  }
  @Post('studentLogin')
  studentLogin(@Body() studentLoginDto: StudentLoginDto) {
    return this.authService.studentLogin(studentLoginDto);
  }
  @Post('teacherLogin')
  teacherLogin(@Body() teacherLoginDto: TeacherLoginDto) {
    return this.authService.teacherLogin(teacherLoginDto);
  }
}
