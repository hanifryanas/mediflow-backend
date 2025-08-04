import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { InsuranceProviderType } from '../enums';
import { Patient } from './patient.entity';

@Entity('PatientInsurance')
export class PatientInsurance {
  @PrimaryGeneratedColumn('identity')
  patientInsuranceId: number;

  @ManyToOne(() => Patient, (patient) => patient.insurances)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ type: 'enum', enum: InsuranceProviderType })
  insuranceProvider: InsuranceProviderType;

  @Column()
  policyNumber: string;
}