import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Query, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequiredRole } from 'common/decorators/required-role.decorator';
import { UserRole } from 'modules/user/enums/user-role.enum';
import { UserService } from 'modules/user/services/user.service';
import { CreatePatientDto } from '../dtos/create-patient.dto';
import { FilterPatientDto } from '../dtos/filter-patient.dto';
import { Patient } from '../entities/patient.entity';
import { PatientService } from '../services/patient.service';

@Controller('patients')
@ApiTags('Patients')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class PatientController {
  constructor(
    private readonly patientService: PatientService,
    private readonly userService: UserService,
  ) { }

  @RequiredRole(UserRole.Staff)
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

  @RequiredRole(UserRole.Staff)
  @Delete(':patientId')
  async delete(@Param('patientId') patientId: number): Promise<void> {
    await this.patientService.delete(patientId);
  }
}