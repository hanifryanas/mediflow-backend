import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from 'modules/doctor/entities/doctor.entity';
import { Nurse } from 'modules/nurse/entities/nurse.entity';
import { Patient } from 'modules/patient/entities/patient.entity';
import { AppointmentController } from './controllers/appointment.controller';
import { Appointment } from './entities/appointment.entity';
import { AppointmentService } from './services/appoinment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Doctor, Patient, Nurse])],
  providers: [AppointmentService],
  controllers: [AppointmentController]
})
export class AppointmentModule { }
