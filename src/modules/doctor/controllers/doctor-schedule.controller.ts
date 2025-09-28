import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Put, Query, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FilterDoctorScheduleDto } from '../dtos/filter-doctor-schedule.dto';
import { UpsertDoctorScheduleDto } from '../dtos/upsert-doctor-schedule.dto';
import { DoctorSchedule } from '../entities/doctor-schedule.entity';
import { DoctorScheduleService } from '../services/doctor-schedule.service';

@Controller('doctors/schedules')
@ApiTags('Doctor-Schedule')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class DoctorScheduleController {
  constructor(
    private readonly doctorScheduleService: DoctorScheduleService,
  ) { }

  @Get()
  @ApiQuery({ name: 'doctorId', required: false, type: String })
  @ApiQuery({ name: 'day', required: false, type: String })
  @ApiQuery({ name: 'startTime', required: false, type: String })
  @ApiQuery({ name: 'endTime', required: false, type: String })
  async findAll(@Query() filterDoctorScheduleDto: FilterDoctorScheduleDto): Promise<DoctorSchedule[]> {
    return this.doctorScheduleService.findBy(filterDoctorScheduleDto);
  }

  @Put()
  async update(@Body() upsertDoctorScheduleDto: UpsertDoctorScheduleDto): Promise<void> {
    return await this.doctorScheduleService.upsert(upsertDoctorScheduleDto);
  }

  @Delete()
  @ApiQuery({ name: 'doctorId', required: true, type: String })
  async deleteByDoctorId(@Query('doctorId') doctorId: string): Promise<void> {
    return await this.doctorScheduleService.deleteByDoctorId(doctorId);
  }

  @Delete(':doctorScheduleId')
  async deleteById(@Param('doctorScheduleId') doctorScheduleId: number): Promise<void> {
    return await this.doctorScheduleService.delete(doctorScheduleId);
  }
}
