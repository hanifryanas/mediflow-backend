import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'modules/user/entities';
import { UserService } from 'modules/user/services';
import { PatientController } from './controllers';
import { Patient } from './entities';
import { PatientService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, User])],
  controllers: [PatientController],
  providers: [PatientService, UserService],
  exports: [PatientService],
})
export class PatientModule { }