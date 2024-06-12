import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { TeachersService } from 'src/teachers/teachers.service';
import { CommonService } from '../../common/common.service';

@Injectable()
export class CourseService {

  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly teacherService: TeachersService,
    private readonly commonService: CommonService
  ) {}

  async create(createCourseDto: CreateCourseDto) {

    const { name, teacherId } =  createCourseDto;

    const teacher = await this.teacherService.findOne(teacherId);

    if(!teacher) throw new NotFoundException(`Teacher with id ${teacherId} not found`)
    
    try {
      
      let course = this.courseRepository.create({
        ...createCourseDto
      })
      course.teacher = teacher

      await this.courseRepository.save(course);

      return course;

    } catch (error) {
      this.commonService.handleDBErrors(error)
    }
  }

  async findAll() {
    return await this.courseRepository.find({});
  }

  async findOne(term: string) {

    let course: Course;
    course = await this.courseRepository.findOneBy({ id: term });
    if(!course){
      course = await this.courseRepository.findOneBy({ name: term });
    }

    if(!course) throw new NotFoundException(`Course with term ${term} not found`);

    return course;

  }


  async update(id: string, updateCourseDto: UpdateCourseDto) {

    const { name, teacherId } = updateCourseDto;

    let course = await this.courseRepository.findOneBy({id})

    if(!course) throw new NotFoundException(`Course With id ${id} not found`)
    
    if(name){
      course.name = name
    }

    if(teacherId){
      const teacher = await this.teacherService.findOne(teacherId);
      course.teacher = teacher;
    }

    try {
      await this.courseRepository.save(course)
      return course
    } catch (error) {
      this.commonService.handleDBErrors(error)
    }

    
  }

  async remove(id: string) {
    const course = await this.findOne(id);
    
    await this.courseRepository.remove(course);

    return `Deleted Successfully`;
  }
}
