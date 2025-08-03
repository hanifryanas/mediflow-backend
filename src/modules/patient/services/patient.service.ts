// set the patient service like user service does

import { InjectRepository } from '@nestjs/typeorm';
import { FilterUserDto } from 'modules/user/dtos';
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

  async findBy(filterPatientDto: FilterPatientDto | FilterUserDto): Promise<Patient[]> {
    if ('insuranceProvider' in filterPatientDto) {
      return await this.patientRepository.find({
        where: {
          insuranceProvider: filterPatientDto.insuranceProvider,
        },
      });
    }

    const { userName, identityNumber, email, phoneNumber } = filterPatientDto as FilterUserDto;
    return await this.patientRepository.find({
      where: {
        user: {
          userName,
          identityNumber,
          email,
          phoneNumber,
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