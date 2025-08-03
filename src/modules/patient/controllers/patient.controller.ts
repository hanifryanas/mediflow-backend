import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import { UserService } from 'modules/user/services';
import { CreatePatientDto, FilterPatientDto } from '../dtos';
import { Patient } from '../entities';
import { PatientService } from '../services/patient.service';

@Controller('patients')
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
  async findOne(@Param('patientId') patientId: string): Promise<Patient | null> {
    const patient = await this.patientService.findOneBy('patientId', patientId);

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${patientId} not found`);
    }

    return patient;
  }

  @Post()
  async create(@Body() createPatientDto: CreatePatientDto): Promise<number> {
    const user = await this.userService.findOneBy('userId', createPatientDto.userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${createPatientDto.userId} not found`);
    }

    return await this.patientService.create(createPatientDto);
  }

  @Put(':patientId')
  async update(@Param('patientId') patientId: string, @Body() updatePatientDto: CreatePatientDto): Promise<void> {
    const patient = await this.patientService.findOneBy('patientId', patientId);

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${patientId} not found`);
    }

    await this.patientService.update(Number(patientId), updatePatientDto);
  }

  @Delete(':patientId')
  async delete(@Param('patientId') patientId: number): Promise<void> {
    const patient = await this.patientService.findOneBy('patientId', patientId);

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${patientId} not found`);
    }

    await this.patientService.delete(patientId);
  }
}