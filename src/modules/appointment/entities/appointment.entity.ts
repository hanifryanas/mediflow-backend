import { Status } from 'common/enums/status.enum';
import { Doctor } from 'modules/doctor/entities/doctor.entity';
import { Nurse } from 'modules/nurse/entities/nurse.entity';
import { Patient } from 'modules/patient/entities/patient.entity';
import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Appointment')
export class Appointment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  appointmentId: string;

  @Column({ type: 'enum', enum: Status, default: Status.Incompleted })
  status: Status;

  @Column({ type: 'timestamp' })
  date: Date;

  @ManyToOne(() => Patient, (patient) => patient.appointments, { eager: true })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments, { eager: true })
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  @ManyToMany(() => Nurse, (nurse) => nurse.appointments)
  @JoinColumn({ name: 'nurseId' })
  nurses?: Nurse[];

  @Column({ type: 'text' })
  concern: string;

  @Column({ type: 'text', nullable: true })
  diagnosis?: string;
}