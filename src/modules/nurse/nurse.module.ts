import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'modules/employee/entities/employee.entity';
import { EmployeeService } from 'modules/employee/services/employee.service';
import { User } from 'modules/user/entities/user.entity';
import { NurseScheduleController } from './controllers/nurse-schedule.controller';
import { NurseController } from './controllers/nurse.controller';
import { NurseSchedule } from './entities/nurse-schedule.entity';
import { Nurse } from './entities/nurse.entity';
import { NurseScheduleService } from './services/nurse-schedule.service';
import { NurseService } from './services/nurse.service';

@Module({
  imports: [TypeOrmModule.forFeature([Nurse, NurseSchedule, Employee, User])],
  providers: [NurseService, NurseScheduleService, EmployeeService],
  controllers: [NurseController, NurseScheduleController],
})
export class NurseModule { }
