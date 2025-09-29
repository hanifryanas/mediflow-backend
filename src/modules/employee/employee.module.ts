import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from 'modules/doctor/entities/doctor.entity';
import { Nurse } from 'modules/nurse/entities/nurse.entity';
import { User } from 'modules/user/entities/user.entity';
import { UserService } from 'modules/user/services/user.service';
import { EmployeeController } from './controllers/employee.controller';
import { Employee } from './entities/employee.entity';
import { EmployeeService } from './services/employee.service';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Doctor, Nurse, User])],
  controllers: [EmployeeController],
  providers: [EmployeeService, UserService],
})
export class EmployeeModule { }
