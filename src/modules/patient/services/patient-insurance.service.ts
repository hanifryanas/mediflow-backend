import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientInsurance } from '../entities/patient-insurance.entity';

export class PatientInsuranceService {
  constructor(
    @InjectRepository(PatientInsurance)
    private readonly patientInsuranceRepository: Repository<PatientInsurance>,
  ) { }

  async findAll(): Promise<PatientInsurance[]> {
    return await this.patientInsuranceRepository.find({ select: ['insuranceProvider', 'policyNumber'] });
  }

  async findByPatientId(patientId: number): Promise<PatientInsurance[]> {
    return await this.patientInsuranceRepository.find({
      where: { patient: { patientId } },
      relations: ['patient'],
    });
  }

  async findOne(patientInsuranceId: number): Promise<PatientInsurance | null> {
    return await this.patientInsuranceRepository.findOne({
      where: { patientInsuranceId },
    });
  }

  async create(patientInsurance: Partial<PatientInsurance>): Promise<number> {
    const newPatientInsurance = this.patientInsuranceRepository.create(patientInsurance);
    const createdPatientInsurance = await this.patientInsuranceRepository.save(newPatientInsurance);
    return createdPatientInsurance.patientInsuranceId;
  }

  async update(patientInsuranceId: number, patientInsurance: Partial<PatientInsurance>): Promise<void> {
    await this.patientInsuranceRepository.update(patientInsuranceId, patientInsurance);
  }

  async delete(patientInsuranceId: number): Promise<void> {
    await this.patientInsuranceRepository.delete(patientInsuranceId);
  }

  async deleteByPatientId(patientId: number): Promise<void> {
    await this.patientInsuranceRepository.delete({ patient: { patientId } });
  }
}