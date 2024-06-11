import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
