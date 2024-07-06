import { Quiz } from 'src/course/quiz/entities';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from './student.entity';

@Entity('studentGrade')
export class StudentGrade {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('float')
  grade: number;
  @Column('varchar')
  date: string;
  @ManyToOne(() => Quiz, (quiz) => quiz.studentGrades, { onDelete: 'CASCADE' })
  quiz: Quiz;
  @ManyToOne(() => Student, (student) => student.studentGrades, {
    onDelete: 'CASCADE',
  })
  student: Student;
  @BeforeInsert()
  setDate() {
    this.date = new Date().toISOString();
  }
}
