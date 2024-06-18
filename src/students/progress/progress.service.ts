import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Progress } from './entities/progress.entity';
import { Repository } from 'typeorm';
import { StudentService } from '../student/student.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ProgressService {

  constructor(
    @InjectRepository(Progress)
    private readonly progressRepository: Repository<Progress>,
    private readonly studentService: StudentService
  ) {}

  async create(createProgressDto: CreateProgressDto) {
    const { studentId, ...modules } = createProgressDto;

    const student = await this.studentService.findOne(studentId);
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    const progress = this.progressRepository.create({ student, ...modules });
    return this.progressRepository.save(progress);
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit=10, offset =0 } = paginationDto;
    let students = await this.progressRepository.find({
      take: limit,
      skip: offset,
      relations: ['student']
    });
    return students;
  }

  async findOne(id: string) {
    const progress = await this.progressRepository.findOne({ where: { id }, relations: ['student'] });
    if (!progress) {
      throw new NotFoundException(`Progress with ID ${id} not found`);
    }
    return progress;
  }

  async update(id: string, updateProgressDto: UpdateProgressDto) {
    const progress = await this.progressRepository.findOne({ where: { id }, relations: ['student'] });
    if (!progress) {
      throw new NotFoundException(`Progress with ID ${id} not found`);
    }

    Object.assign(progress, updateProgressDto);
    return this.progressRepository.save(progress);
  }

 async remove(id: string) {
    const progress = await this.progressRepository.findOne({ where: { id } });
    if (!progress) {
      throw new NotFoundException(`Progress with ID ${id} not found`);
    }
    await this.progressRepository.remove(progress);
  }
}
