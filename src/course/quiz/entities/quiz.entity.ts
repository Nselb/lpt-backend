import { Course } from "src/course/course/entities/course.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { QuizType } from "./quizType.entity";
import { Question } from "src/course/question/entities/question.entity";


@Entity(`quizzes`)
export class Quiz {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar')
    name: string;

    @Column('boolean', {
        default: true
    })
    isActive: boolean;

    @ManyToOne(() => Course, course => course.quizzes, {onDelete: 'CASCADE'})
    course: Course

    @ManyToOne(() => QuizType, quizType => quizType.quizzes)
    quizType: QuizType;

    @OneToMany(() => Question, question => question.quiz, {onDelete: 'CASCADE'})
    questions: Question[];

}
