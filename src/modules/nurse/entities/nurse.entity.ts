import { Expose } from 'class-transformer';
import { Employee } from 'modules/employee/entities/employee.entity';
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { NurseSchedule } from './nurse-schedule.entity';

@Entity('Nurse')
export class Nurse {
  @PrimaryGeneratedColumn('uuid')
  nurseId: string;

  @OneToOne(() => Employee, (employee) => employee.nurse, { onDelete: 'CASCADE' })
  employee: Employee;

  @Column({ length: 50 })
  title?: string;

  @OneToMany(() => NurseSchedule, (schedule) => schedule.nurse, { onDelete: 'CASCADE' })
  schedules?: NurseSchedule[];

  @Expose({ toPlainOnly: true })
  get isAvailable(): boolean | undefined {
    if (!this.schedules || this.schedules.length === 0) return undefined;

    const now = new Date();
    const day = now.toLocaleString('en-US', { weekday: 'long' });
    const currentTime = now.toTimeString().slice(0, 5);

    return this.schedules.some(s =>
      s.day === day &&
      currentTime >= s.startTime &&
      currentTime <= s.endTime
    );
  }
}
