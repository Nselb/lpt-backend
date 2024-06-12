import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Quiz } from "./quiz.entity";


@Entity('quiztype')
export class QuizType {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('varchar')
    name: string;
    @OneToMany(() => Quiz, quiz => quiz.quizType)
    quizzes: Quiz[]

}