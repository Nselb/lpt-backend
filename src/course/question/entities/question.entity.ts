import { Answer } from 'src/course/answer/entities/answer.entity';
import { Quiz } from 'src/course/quiz/entities';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('varchar', {
    nullable: false,
  })
  text: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, { onDelete: 'CASCADE' })
  quiz: Quiz;
  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];
}
