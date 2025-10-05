import { Day } from 'common/enums/day.enum';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Nurse } from './nurse.entity';

@Entity('NurseSchedule')
export class NurseSchedule {
  @PrimaryGeneratedColumn('identity')
  nurseScheduleId: number;

  @ManyToOne(() => Nurse, (nurse) => nurse.schedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'nurseId' })
  nurse: Nurse;

  @Column({ type: 'enum', enum: Day })
  day: Day;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;
}
