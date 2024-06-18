import { Student } from "src/students/student/entities/student.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('progress')
export class Progress {

    @PrimaryColumn('varchar')
    id: string;
    @Column('boolean', {default: false})
    abstractionTheory: boolean
    @Column('boolean', {default: false})
    encapsulationTheory: boolean
    @Column('boolean', {default: false})
    inheritanceTheory: boolean;
    @Column('boolean', {default: false})
    polymorphismTheory: boolean
    @Column('boolean', {default: false})
    abstractionGame: boolean
    @Column('boolean', {default: false})
    inheritanceGame: boolean
    @Column('boolean', {default: false})
    polymorphismGame: boolean
    @Column('boolean', {default: false})
    encapsulationGame: boolean
    @Column('boolean', {default: false})
    abstractionExcercise: boolean
    @Column('boolean', {default: false})
    encapsulationExcercise: boolean
    @Column('boolean', {default: false})
    inheritanceExcercise: boolean
    @Column('boolean', {default: false})
    polymorphismExcercise: boolean

    @OneToOne(() => Student, student => student.progress, {onDelete: 'CASCADE'})
    @JoinColumn()
    student: Student



}
