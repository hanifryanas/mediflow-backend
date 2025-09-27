import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { FilterDoctorScheduleDto } from '../dtos/filter-doctor-schedule.dto';
import { UpsertDoctorScheduleDto } from '../dtos/upsert-doctor-schedule.dto';
import { DoctorSchedule } from '../entities/doctor-schedule.entity';

@Injectable()
export class DoctorScheduleService {
  constructor(
    @InjectRepository(DoctorSchedule)
    private readonly doctorScheduleRepository: Repository<DoctorSchedule>,
  ) { }

  async findBy(filterDoctorScheduleDto: FilterDoctorScheduleDto): Promise<DoctorSchedule[]> {
    if (filterDoctorScheduleDto.startTime || filterDoctorScheduleDto.endTime) {
      const filterOption: any = {};
      if (filterDoctorScheduleDto.doctorId) filterOption.doctor.doctorId = filterDoctorScheduleDto.doctorId;
      if (filterDoctorScheduleDto.department) filterOption.employee.department = filterDoctorScheduleDto.department;
      if (filterDoctorScheduleDto.day) filterOption.day = filterDoctorScheduleDto.day;
      if (filterDoctorScheduleDto.startTime) filterOption.startTime = MoreThanOrEqual(filterDoctorScheduleDto.startTime);
      if (filterDoctorScheduleDto.endTime) filterOption.endTime = LessThanOrEqual(filterDoctorScheduleDto.endTime);

      return await this.doctorScheduleRepository.find({ where: filterOption, relations: ['doctor', 'doctor.employee', 'doctor.employee.user'] });
    }

    return await this.doctorScheduleRepository.findBy(filterDoctorScheduleDto);
  }

  async findByDoctorId(doctorId: string): Promise<DoctorSchedule[]> {
    return await this.doctorScheduleRepository.find({ where: { doctor: { doctorId } }, relations: ['doctor', 'doctor.employee', 'doctor.employee.user'] });
  }

  async findOne(doctorScheduleId: number): Promise<DoctorSchedule> {
    const doctorSchedule = await this.doctorScheduleRepository.findOne({ where: { doctorScheduleId } });

    if (!doctorSchedule) {
      throw new NotFoundException(`Doctor schedule with ID ${doctorScheduleId} not found`);
    }

    return doctorSchedule;
  }

  async upsert(upsertDoctorScheduleDto: UpsertDoctorScheduleDto): Promise<void> {
    await this.doctorScheduleRepository.delete({ doctor: { doctorId: upsertDoctorScheduleDto.doctorId } });

    const schedulesWithDoctor = upsertDoctorScheduleDto.schedules.map(schedule => ({
      ...schedule,
      doctor: { doctorId: upsertDoctorScheduleDto.doctorId },
    }));

    await this.doctorScheduleRepository.save(schedulesWithDoctor);
  }

  async deleteByDoctorId(doctorId: string): Promise<void> {
    const doctor = await this.doctorScheduleRepository.findOne({ where: { doctor: { doctorId } } });

    if (!doctor) {
      throw new NotFoundException(`Doctor schedule for Doctor ID ${doctorId} not found`);
    }

    await this.doctorScheduleRepository.delete({ doctor: { doctorId } });
  }

  async delete(doctorScheduleId: number): Promise<void> {
    await this.doctorScheduleRepository.delete({ doctorScheduleId });
  }
}