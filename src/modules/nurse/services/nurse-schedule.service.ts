import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterNurseScheduleDto } from '../dtos/filter-nurse-schedule.dto';
import { UpsertNurseScheduleDto } from '../dtos/upsert-nurse-schedule.dto';
import { NurseSchedule } from '../entities/nurse-schedule.entity';

@Injectable()
export class NurseScheduleService {
  constructor(
    @InjectRepository(NurseSchedule)
    private readonly nurseScheduleRepository: Repository<NurseSchedule>,
  ) { }

  async findBy(filterNurseScheduleDto: FilterNurseScheduleDto): Promise<NurseSchedule[]> {
    if (filterNurseScheduleDto.nurseId || filterNurseScheduleDto.department) {
      const filterOption: any = {};
      if (filterNurseScheduleDto.nurseId) filterOption.nurse.nurseId = filterNurseScheduleDto.nurseId;
      if (filterNurseScheduleDto.department) filterOption.employee.department = filterNurseScheduleDto.department;
      if (filterNurseScheduleDto.day) filterOption.day = filterNurseScheduleDto.day;
      if (filterNurseScheduleDto.startTime) filterOption.startTime = filterNurseScheduleDto.startTime;
      if (filterNurseScheduleDto.endTime) filterOption.endTime = filterNurseScheduleDto.endTime;

      return await this.nurseScheduleRepository.find({ where: filterOption, relations: ['nurse', 'nurse.employee', 'nurse.employee.user'] });
    }

    return await this.nurseScheduleRepository.findBy(filterNurseScheduleDto);
  }

  async findByNurseId(nurseId: string): Promise<NurseSchedule[]> {
    return await this.nurseScheduleRepository.find({ where: { nurse: { nurseId } }, relations: ['nurse', 'nurse.employee', 'nurse.employee.user'] });
  }

  async findOne(nurseScheduleId: number): Promise<NurseSchedule> {
    const nurseSchedule = await this.nurseScheduleRepository.findOne({ where: { nurseScheduleId } });

    if (!nurseSchedule) {
      throw new NotFoundException(`Nurse schedule with ID ${nurseScheduleId} not found`);
    }

    return nurseSchedule;
  }

  async upsert(upsertNurseScheduleDto: UpsertNurseScheduleDto): Promise<void> {
    await this.nurseScheduleRepository.delete({ nurse: { nurseId: upsertNurseScheduleDto.nurseId } });

    const schedulesWithNurse = upsertNurseScheduleDto.schedules.map(schedule => ({
      ...schedule,
      nurse: { nurseId: upsertNurseScheduleDto.nurseId },
    }));

    await this.nurseScheduleRepository.save(schedulesWithNurse);
  }

  async upsertByUserId(userId: string, upsertNurseScheduleDto: UpsertNurseScheduleDto): Promise<void> {
    await this.nurseScheduleRepository.delete({ nurse: { employee: { user: { userId } } } });

    const schedulesWithNurse = upsertNurseScheduleDto.schedules.map(schedule => ({
      ...schedule,
      nurse: { employee: { user: { userId } } },
    }));

    await this.nurseScheduleRepository.save(schedulesWithNurse);
  }

  async deleteByNurseId(nurseId: string): Promise<void> {
    const nurse = await this.nurseScheduleRepository.findOne({ where: { nurse: { nurseId } } });

    if (!nurse) {
      throw new NotFoundException(`Nurse schedule for Nurse ID ${nurseId} not found`);
    }

    await this.nurseScheduleRepository.delete({ nurse: { nurseId } });
  }

  async delete(nurseScheduleId: number): Promise<void> {
    const nurseSchedule = await this.nurseScheduleRepository.findOne({ where: { nurseScheduleId } });

    if (!nurseSchedule) {
      throw new NotFoundException(`Nurse schedule with ID ${nurseScheduleId} not found`);
    }

    await this.nurseScheduleRepository.delete({ nurseScheduleId });
  }
}