import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateGradeDto, CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PaginationDto } from '../../common/dtos/pagination.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.studentService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.studentService.findOne(term);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }

  @Post('grade')
  gradeQuiz(@Body() createGradeDto: CreateGradeDto) {
    return this.studentService.gradeQuiz(createGradeDto);
  }

  @Get('/grade/:studentId/:quizId')
  getStudentGradeByQuiz(
    @Param('studentId') studentId: string,
    @Param('quizId') quizId: string,
  ) {
    return this.studentService.getStudentGradesByQuiz(studentId, quizId);
  }
}
