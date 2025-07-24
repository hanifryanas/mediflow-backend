import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

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

  @Column({ type: 'enum', enum: ['male', 'female'] })
  gender: 'male' | 'female';

  @Column()
  phoneNumber: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ nullable: true })
  address?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
