import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterPatientDto } from '../dtos/filter-patient.dto';
import { Patient } from '../entities/patient.entity';

export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) { }

  async findAll(): Promise<Patient[]> {
    return await this.patientRepository.find();
  }

  async findOneBy(patientField: keyof Patient, patientValue: Patient[keyof Patient]): Promise<Patient | null> {
    return await this.patientRepository.findOneBy({ [patientField]: patientValue });
  }

  async findBy(filterPatientDto: FilterPatientDto): Promise<Patient[]> {
    return await this.patientRepository.find({
      where: {
        insurances: {
          insuranceProvider: filterPatientDto.insuranceProvider,
        },
        user: {
          identityNumber: filterPatientDto.identityNumber,
          userName: filterPatientDto.userName,
          email: filterPatientDto.email,
          phoneNumber: filterPatientDto.phoneNumber,
        },
      },
      relations: ['user'],
    });
  }

  async create(patient: Partial<Patient>): Promise<number> {
    const createPatientDto = this.patientRepository.create(patient);
    const createdPatient = await this.patientRepository.save(createPatientDto);

    return createdPatient.patientId;
  }

  async delete(patientId: number): Promise<void> {
    await this.patientRepository.delete(patientId);
  }
}