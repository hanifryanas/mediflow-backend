import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { differenceInYears } from 'date-fns';
import { Patient } from 'modules/patient/entities/patient.entity';
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserGenderType } from '../enums/user-gender.enum';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ length: 20, unique: true })
  identityNumber: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 25, unique: true })
  userName: string;

  @Column({ length: 16, select: false })
  @Exclude({ toPlainOnly: true })
  @ApiHideProperty()
  password: string;

  @Column({ length: 25 })
  firstName: string;

  @Column({ length: 25 })
  lastName: string;

  @Column({ type: 'enum', enum: UserGenderType })
  gender: UserGenderType;

  @Column()
  phoneNumber: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  get age(): number {
    return differenceInYears(new Date(), new Date(this.dateOfBirth));
  }

  @OneToOne(() => Patient, (patient) => patient.user)
  patient: Patient;

  @Column({ nullable: true })
  address?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
