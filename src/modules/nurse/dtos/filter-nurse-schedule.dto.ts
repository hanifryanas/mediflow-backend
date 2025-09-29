import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { EmployeeDepartment } from 'modules/employee/enums/employee-department.enum';
import { NurseSchedule } from '../entities/nurse-schedule.entity';

export class FilterNurseScheduleDto extends PartialType(NurseSchedule) {
  @IsString()
  nurseId?: string;

  @IsEnum(EmployeeDepartment)
  department?: EmployeeDepartment;
}