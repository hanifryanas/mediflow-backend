import { BadRequestException, NotFoundException } from '@nestjs/common';
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
    return await this.patientRepository.find({ relations: ['user'] });
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

  async findOneBy(patientField: keyof Patient, patientValue: Patient[keyof Patient]): Promise<Patient> {
    const patient = await this.patientRepository.findOneBy({ [patientField]: patientValue });

    if (!patient) {
      throw new NotFoundException(`Patient with ${patientField} ${patientValue} not found`);
    }

    return patient;
  }

  async findOneByUserId(userId: string): Promise<Patient> {
    const patient = await this.patientRepository.findOneBy({ user: { userId } });

    if (!patient) {
      throw new NotFoundException(`Patient with userId ${userId} not found`);
    }

    return patient;
  }

  async create(patient: Partial<Patient>): Promise<number> {
    const createPatientDto = this.patientRepository.create(patient);
    const createdPatient = await this.patientRepository.save(createPatientDto);

    if (!createdPatient) {
      throw new BadRequestException('Failed to create patient');
    }

    return createdPatient.patientId;
  }

  async delete(patientId: number): Promise<void> {
    const result = await this.patientRepository.delete(patientId);

    if (!result.affected) {
      throw new BadRequestException(`Failed to delete patient with ID ${patientId}`);
    }
  }
}