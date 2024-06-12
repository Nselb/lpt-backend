import { Quiz } from "src/course/quiz/entities/quiz.entity";
import { Teacher } from "src/teachers/entities/teacher.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("courses")
export class Course {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar',{
        unique: true
    })
    name: string;

    @Column('boolean',{
        default: true,
    })
    isActive: boolean

    @ManyToOne(() => Teacher, teacher => teacher.courses)
    teacher: Teacher

    @OneToMany(() => Quiz, quiz => quiz.course)
    quizzes: Quiz[]

}
