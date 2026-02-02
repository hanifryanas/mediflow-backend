import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { EmployeeDepartment } from '../../employee/enums/employee-department.enum';
import { DoctorSchedule } from '../entities/doctor-schedule.entity';

export class FilterDoctorScheduleDto extends PartialType(DoctorSchedule) {
  @IsString()
  doctorId?: string;

  @IsEnum(EmployeeDepartment)
  department?: EmployeeDepartment;
}
