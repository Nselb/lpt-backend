import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('varchar')
  firstName: string;
  @Column('varchar')
  lastName: string;
  @Column('varchar', { unique: true })
  username: string;
  @Column('varchar', { select: false })
  password: string;
  @Column('bool', { default: true })
  isActive: boolean;

  @BeforeUpdate()
  checkCapitalizeInsert() {
    this.firstName = this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1)
  }
  @BeforeInsert()
  checkCapitalizeUpdate(){
    this.firstName = this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1)
  }

}

