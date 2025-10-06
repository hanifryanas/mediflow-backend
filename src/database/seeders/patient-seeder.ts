import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientInsurance } from 'modules/patient/entities/patient-insurance.entity';
import { Patient } from 'modules/patient/entities/patient.entity';
import { User } from 'modules/user/entities/user.entity';
import { DataFactory, Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';

@Injectable()
export class PatientSeeder implements Seeder {
  private generatedPatients: Partial<Patient>[] = [];

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(PatientInsurance)
    private readonly patientInsuranceRepository: Repository<PatientInsurance>,
  ) {
    this.generatedPatients = DataFactory.createForClass(Patient)
      .generate(10)
      .map(data => this.patientRepository.create(data));
  }

  seed() {
    return this.patientRepository.save(this.generatedPatients);
  }

  drop() {
    return this.patientRepository.clear();
  }
}