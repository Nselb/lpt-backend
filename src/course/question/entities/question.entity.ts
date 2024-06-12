import { Quiz } from "src/course/quiz/entities";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('questions')
export class Question {


    @PrimaryGeneratedColumn('uuid')
    id:string;
    @Column('varchar', {
        nullable: false
    })
    text: string;

    @ManyToOne(() => Quiz, quiz => quiz.questions)
    quiz: Quiz

}
