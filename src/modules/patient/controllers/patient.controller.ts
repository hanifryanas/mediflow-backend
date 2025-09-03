import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from 'modules/user/services/user.service';
import { CreatePatientDto } from '../dtos/create-patient.dto';
import { FilterPatientDto } from '../dtos/filter-patient.dto';
import { Patient } from '../entities/patient.entity';
import { PatientService } from '../services/patient.service';

@Controller('patients')
@ApiTags('Patients')
export class PatientController {
  constructor(
    private readonly patientService: PatientService,
    private readonly userService: UserService,
  ) { }

  @Get()
  async findAll(@Query() query: FilterPatientDto): Promise<Patient[]> {
    return await this.patientService.findBy(query);
  }

  @Get(':patientId')
  async findOne(@Param('patientId') patientId: number): Promise<Patient> {
    return await this.patientService.findOneBy('patientId', patientId);
  }

  @Post()
  async create(@Body() createPatientDto: CreatePatientDto): Promise<number> {
    const user = await this.userService.findOneBy({ userId: createPatientDto.userId });

    const createPatient = {
      ...createPatientDto,
      user: user,
    };

    return await this.patientService.create(createPatient);
  }

  @Delete(':patientId')
  async delete(@Param('patientId') patientId: number): Promise<void> {
    await this.patientService.delete(patientId);
  }
}