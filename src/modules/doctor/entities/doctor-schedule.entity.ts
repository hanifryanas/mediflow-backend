import { BaseEntity } from '../../../common/entities/base.entity';
import { Day } from '../../../common/enums/day.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Doctor } from './doctor.entity';

@Entity('DoctorSchedule')
export class DoctorSchedule extends BaseEntity {
  @PrimaryGeneratedColumn('identity')
  doctorScheduleId: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.schedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  @Column({ type: 'enum', enum: Day })
  day: Day;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;
}
