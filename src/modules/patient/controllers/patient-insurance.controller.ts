import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { isNullOrUndefined } from 'common/functions';
import { CreatePatientInsuranceDto } from '../dtos';
import { PatientInsurance } from '../entities';
import { PatientInsuranceService, PatientService } from '../services';

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
  async findOne(@Param('patientInsuranceId') patientInsuranceId: number): Promise<PatientInsurance | null> {
    const patientInsurance = await this.patientInsuranceService.findOne(patientInsuranceId);

    if (isNullOrUndefined(patientInsurance)) {
      throw new NotFoundException(`Patient insurance with ID ${patientInsuranceId} not found`);
    }

    return patientInsurance;
  }

  @Post()
  async create(@Param('patientId') patientId: number, @Body() createPatientInsuranceDto: CreatePatientInsuranceDto): Promise<number> {
    const patient = await this.patientService.findOneBy('patientId', patientId);

    if (isNullOrUndefined(patient)) {
      throw new NotFoundException(`Patient with ID ${patientId} not found`);
    }

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
    const patientInsurance = await this.patientInsuranceService.findOne(patientInsuranceId);

    if (isNullOrUndefined(patientInsurance)) {
      throw new NotFoundException(`Patient insurance with ID ${patientInsuranceId} not found`);
    }

    await this.patientInsuranceService.update(patientInsuranceId, updatePatientInsuranceDto);
  }

  @Delete()
  async deleteByPatientId(@Param('patientId') patientId: number): Promise<void> {
    const patient = await this.patientService.findOneBy('patientId', patientId);

    if (isNullOrUndefined(patient)) {
      throw new NotFoundException(`Patient with ID ${patientId} not found`);
    }

    await this.patientInsuranceService.deleteByPatientId(patientId);
  }

  @Delete(':patientInsuranceId')
  async delete(@Param('patientInsuranceId') patientInsuranceId: number): Promise<void> {
    const patientInsurance = await this.patientInsuranceService.findOne(patientInsuranceId);

    if (isNullOrUndefined(patientInsurance)) {
      throw new NotFoundException(`Patient insurance with ID ${patientInsuranceId} not found`);
    }

    await this.patientInsuranceService.delete(patientInsuranceId);
  }
}