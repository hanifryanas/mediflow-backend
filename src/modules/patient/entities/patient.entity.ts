import { BaseEntity } from 'common/entities/base.entity';
import { User } from 'modules/user/entities/user.entity';
import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PatientInsurance } from './patient-insurance.entity';
import { Appointment } from 'modules/appointment/entities/appointment.entity';

@Entity('Patient')
export class Patient extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  patientId: string;

  @OneToOne(() => User, (user) => user.userId, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => PatientInsurance, (insurance) => insurance.patient, { cascade: true })
  insurances?: PatientInsurance[];

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments?: Appointment[];
}