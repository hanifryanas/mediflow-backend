import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'modules/user/entities';
import { UserService } from 'modules/user/services';
import { PatientController, PatientInsuranceController } from './controllers';
import { Patient, PatientInsurance } from './entities';
import { PatientInsuranceService, PatientService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, PatientInsurance, User])],
  controllers: [PatientController, PatientInsuranceController],
  providers: [PatientService, PatientInsuranceService, UserService],
  exports: [PatientService, PatientInsuranceService],
})
export class PatientModule { }