import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InsuranceProviderType } from '../enums/insurance-provider.enum';
import { Patient } from './patient.entity';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('PatientInsurance')
export class PatientInsurance extends BaseEntity {
  @PrimaryGeneratedColumn('identity')
  patientInsuranceId: number;

  @ManyToOne(() => Patient, (patient) => patient.insurances, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ type: 'enum', enum: InsuranceProviderType })
  insuranceProvider: InsuranceProviderType;

  @Column()
  policyNumber: string;
}
