import { Expose } from 'class-transformer';
import { BaseEntity } from 'common/entities/base.entity';
import { Employee } from 'modules/employee/entities/employee.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DoctorSchedule } from './doctor-schedule.entity';

@Entity('Doctor')
export class Doctor extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  doctorId: string;

  @OneToOne(() => Employee, (employee) => employee.doctor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column({ nullable: true, length: 50 })
  title?: string;

  @OneToMany(() => DoctorSchedule, (schedule) => schedule.doctor, { onDelete: 'CASCADE' })
  schedules?: DoctorSchedule[];

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
