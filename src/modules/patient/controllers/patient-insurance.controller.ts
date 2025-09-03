import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePatientInsuranceDto } from '../dtos/create-patient-insurance.dto';
import { PatientInsurance } from '../entities/patient-insurance.entity';
import { PatientInsuranceService } from '../services/patient-insurance.service';
import { PatientService } from '../services/patient.service';

@Controller('patients/:patientId/insurances')
@ApiTags('Patient Insurances')
export class PatientInsuranceController {
  constructor(
    private readonly patientInsuranceService: PatientInsuranceService,
    private readonly patientService: PatientService,
  ) { }

  @Get()
  async findByPatientId(@Param('patientId') patientId: number): Promise<PatientInsurance[]> {
    return this.patientInsuranceService.findByPatientId(patientId);
  }

  @Get(':patientInsuranceId')
  async findOne(@Param('patientInsuranceId') patientInsuranceId: number): Promise<PatientInsurance> {
    return this.patientInsuranceService.findOne(patientInsuranceId);
  }

  @Post()
  async create(@Param('patientId') patientId: number, @Body() createPatientInsuranceDto: CreatePatientInsuranceDto): Promise<number> {
    const patient = await this.patientService.findOneBy('patientId', patientId);

    const createPatientInsurance = {
      ...createPatientInsuranceDto,
      patientId: patient?.patientId,
    };

    return this.patientInsuranceService.create(createPatientInsurance);
  }

  @Put(':patientInsuranceId')
  async update(
    @Param('patientInsuranceId') patientInsuranceId: number,
    @Body() updatePatientInsuranceDto: CreatePatientInsuranceDto,
  ): Promise<void> {
    await this.patientInsuranceService.update(patientInsuranceId, updatePatientInsuranceDto);
  }

  @Delete(':patientInsuranceId')
  async delete(@Param('patientInsuranceId') patientInsuranceId: number): Promise<void> {
    await this.patientInsuranceService.delete(patientInsuranceId);
  }

  @Delete()
  async deleteByPatientId(@Param('patientId') patientId: number): Promise<void> {
    await this.patientInsuranceService.deleteByPatientId(patientId);
  }
}