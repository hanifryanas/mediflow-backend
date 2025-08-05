import { ApiHideProperty } from '@nestjs/swagger';
import { hashSync } from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { differenceInYears } from 'date-fns';
import { Patient } from 'modules/patient/entities/patient.entity';
import { AfterLoad, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserGenderType, UserRole } from '../enums';
import { UserToken } from './user-token.entity';

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

  @Column({ select: false })
  @Exclude({ toPlainOnly: true })
  @ApiHideProperty()
  password: string;

  @Exclude({ toPlainOnly: true })
  @ApiHideProperty()
  private tempPassword?: string;

  @AfterLoad()
  private loadTempPassword(): void {
    this.tempPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  private hashPassword(): void {
    if (this.tempPassword !== this.password) {
      this.password = hashSync(this.password, 10);
    }
  }

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

  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  @Exclude({ toPlainOnly: true })
  role: UserRole;

  @Exclude({ toPlainOnly: true })
  @ApiHideProperty()
  @OneToMany(() => UserToken, (token) => token.user, { cascade: true })
  tokens?: UserToken[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
