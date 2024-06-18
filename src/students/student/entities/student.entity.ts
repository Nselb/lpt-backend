import { Course } from "src/course/course/entities/course.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { StudentGrade } from "./student-grade.entity";
import { Progress } from "src/students/progress/entities/progress.entity";

@Entity('students')
export class Student {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('varchar')
    firstName: string;
    @Column('varchar')
    lastName: string;
    @Column('varchar', { unique: true })
    username: string;
    @Column('varchar', { select: false })
    pin: string;
    @Column('bool', { default: true })
    isActive: boolean;

    @ManyToOne(() => Course, course => course.students, {onDelete: 'CASCADE'})
    course: Course
    @OneToMany(() => StudentGrade, studentGrade => studentGrade.student, {onDelete:'CASCADE'})
    studentGrades: StudentGrade[]
    @OneToOne(() => Progress, progress => progress.student)
    progress: Progress;

}
