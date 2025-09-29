import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'modules/employee/entities/employee.entity';
import { EmployeeService } from 'modules/employee/services/employee.service';
import { User } from 'modules/user/entities/user.entity';
import { DoctorScheduleController } from './controllers/doctor-schedule.controller';
import { DoctorController } from './controllers/doctor.controller';
import { DoctorSchedule } from './entities/doctor-schedule.entity';
import { Doctor } from './entities/doctor.entity';
import { DoctorScheduleService } from './services/doctor-schedule.service';
import { DoctorService } from './services/doctor.service';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, DoctorSchedule, Employee, User])],
  providers: [DoctorService, DoctorScheduleService, EmployeeService],
  controllers: [DoctorController, DoctorScheduleController],
})
export class DoctorModule { }
