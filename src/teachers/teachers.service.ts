import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entities/teacher.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CommonService } from '../common/common.service';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    private readonly commonService: CommonService,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    let teachers = await this.teacherRepository.find({
      take: limit,
      skip: offset,
    });
    return teachers;
  }

  async findOne(term: string) {
    let teacher: Teacher;
    teacher = await this.teacherRepository.findOne({
      where: { id: term },
      relations: ['courses'],
    });
    if (!teacher) {
      teacher = await this.teacherRepository.findOne({
        where: { username: term },
        relations: ['courses'],
      });
    }

    if (!teacher)
      throw new NotFoundException(`Teacher with term ${term} not found`);

    return teacher;
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto) {
    const teacher = await this.teacherRepository.preload({
      id: id,
      ...updateTeacherDto,
    });

    if (!teacher)
      throw new NotFoundException(`Teacher with id ${id} not found`);

    try {
      await this.teacherRepository.save(teacher);
    } catch (error) {
      this.commonService.handleDBErrors(error);
    }

    return teacher;
  }

  async remove(id: string) {
    const teacher = await this.findOne(id);

    await this.teacherRepository.remove(teacher);

    return `Deleted Successfully`;
  }
}
