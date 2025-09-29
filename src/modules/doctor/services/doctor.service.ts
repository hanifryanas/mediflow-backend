import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeService } from 'modules/employee/services/employee.service';
import { Repository } from 'typeorm';
import { CreateDoctorDto } from '../dtos/create-doctor.dto';
import { UpdateDoctorDto } from '../dtos/update-doctor.dto';
import { Doctor } from '../entities/doctor.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    private readonly employeeService: EmployeeService,
  ) { }

  async findById(doctorId: string): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({ where: { doctorId } });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${doctorId} not found`);
    }

    return doctor;
  }

  async findByEmployeeId(employeeId: number): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: {
        employee: {
          employeeId: employeeId,
        },
      },
      relations: ['employee'],
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with Employee ID ${employeeId} not found`);
    }

    return doctor;
  }

  async findByUserId(userId: string): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: {
        employee: {
          user: {
            userId: userId,
          },
        },
      },
      relations: ['employee', 'employee.user'],
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with User ID ${userId} not found`);
    }

    return doctor;
  }

  async findAll(key?: keyof Doctor, value?: Doctor[keyof Doctor], selection?: (keyof Doctor)[]): Promise<Doctor[]> {
    if (key && value) {
      return await this.doctorRepository.find({
        where: { [key]: value },
        relations: ['employee', 'employee.user'],
        select: selection,
      });
    }

    return await this.doctorRepository.find({
      relations: ['employee', 'employee.user'],
      select: selection,
    });
  }

  async create(createDoctorDto: CreateDoctorDto): Promise<string> {
    const { title, ...employeeData } = createDoctorDto;

    const employeeId = await this.employeeService.create(employeeData);

    if (!employeeId) {
      throw new BadRequestException('Failed to create employee');
    }

    const createDoctor = this.doctorRepository.create({
      ...createDoctorDto,
      employee: { employeeId },
    });

    const createdDoctor = await this.doctorRepository.save(createDoctor);

    if (!createdDoctor) {
      throw new BadRequestException('Failed to create doctor');
    }

    return createdDoctor.doctorId;
  }

  async update(doctorId: string, updateDoctorDto: UpdateDoctorDto): Promise<void> {
    const doctor = await this.findById(doctorId);

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${doctorId} not found`);
    }

    await this.doctorRepository.update(doctor.doctorId, updateDoctorDto);
  }

  async deleteByUserId(userId: string): Promise<void> {
    const doctor = await this.findByUserId(userId);

    if (!doctor) {
      throw new NotFoundException(`Doctor with User ID ${userId} not found`);
    }

    await this.doctorRepository.remove(doctor);
  }

  async deleteByEmployeeId(employeeId: number): Promise<void> {
    const doctor = await this.findByEmployeeId(employeeId);

    if (!doctor) {
      throw new NotFoundException(`Doctor with Employee ID ${employeeId} not found`);
    }

    await this.doctorRepository.remove(doctor);
  }

  async delete(doctorId: string): Promise<void> {
    const doctor = await this.findById(doctorId);

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${doctorId} not found`);
    }

    await this.doctorRepository.remove(doctor);
  }
}
