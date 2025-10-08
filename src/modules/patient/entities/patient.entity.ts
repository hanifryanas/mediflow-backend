import { BaseEntity } from 'common/entities/base.entity';
import { User } from 'modules/user/entities/user.entity';
import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PatientInsurance } from './patient-insurance.entity';

@Entity('Patient')
export class Patient extends BaseEntity {
  @PrimaryGeneratedColumn('identity')
  patientId: number;

  @OneToOne(() => User, (user) => user.userId, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => PatientInsurance, (insurance) => insurance.patient, { cascade: true })
  insurances?: PatientInsurance[];
}