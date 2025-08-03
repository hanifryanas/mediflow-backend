// set the patient service like user service does

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePatientDto, FilterPatientDto, UpdatePatientDto } from '../dtos';
import { Patient } from '../entities';

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
        insuranceProvider: filterPatientDto.insuranceProvider,
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

  async create(createPatientDto: CreatePatientDto): Promise<number> {
    const patient = this.patientRepository.create(createPatientDto);
    const createdPatient = await this.patientRepository.save(patient);

    return createdPatient.patientId;
  }

  async update(patientId: number, updatePatientDto: UpdatePatientDto): Promise<void> {
    await this.patientRepository.update(patientId, updatePatientDto);
  }

  async delete(patientId: number): Promise<void> {
    await this.patientRepository.delete(patientId);
  }
}