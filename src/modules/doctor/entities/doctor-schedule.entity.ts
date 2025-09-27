import { Day } from 'common/enums/day.enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Doctor } from './doctor.entity';

@Entity('DoctorSchedule')
export class DoctorSchedule {
  @PrimaryGeneratedColumn('identity')
  doctorScheduleId: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.schedules, { onDelete: 'CASCADE' })
  doctor: Doctor;

  @Column({ type: 'enum', enum: Day })
  day: Day

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;
}
