import { User } from 'modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { InsuranceProviderType } from '../enums';

@Entity('Patient')
export class Patient {
  @PrimaryGeneratedColumn('identity')
  patientId: number;

  @OneToOne(() => User, (user) => user.userId, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @Column({ type: 'enum', enum: InsuranceProviderType, nullable: true })
  insuranceProvider?: InsuranceProviderType;

  @Column({ nullable: true })
  insurancePolicyNumber?: string;
}