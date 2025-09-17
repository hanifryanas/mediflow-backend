import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequiredRole } from 'common/decorators/required-role.decorator';
import { UserRole } from 'modules/user/enums/user-role.enum';
import { CreatePatientInsuranceDto } from '../dtos/create-patient-insurance.dto';
import { PatientInsurance } from '../entities/patient-insurance.entity';
import { PatientInsuranceService } from '../services/patient-insurance.service';
import { PatientService } from '../services/patient.service';

@Controller('patients/:patientId/insurances')
@ApiTags('Patient Insurances')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class PatientInsuranceController {
  constructor(
    private readonly patientInsuranceService: PatientInsuranceService,
    private readonly patientService: PatientService,
  ) { }

  @RequiredRole(UserRole.Staff)
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

  @RequiredRole(UserRole.Staff)
  @Delete(':patientInsuranceId')
  async delete(@Param('patientInsuranceId') patientInsuranceId: number): Promise<void> {
    await this.patientInsuranceService.delete(patientInsuranceId);
  }

  @RequiredRole(UserRole.Staff)
  @Delete()
  async deleteByPatientId(@Param('patientId') patientId: number): Promise<void> {
    await this.patientInsuranceService.deleteByPatientId(patientId);
  }
}