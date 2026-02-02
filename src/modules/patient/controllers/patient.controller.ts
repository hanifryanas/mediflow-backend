import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequiredRole } from '../../../common/decorators/required-role.decorator';
import { UserRole } from '../../user/enums/user-role.enum';
import { UserService } from '../../user/services/user.service';
import { CreatePatientDto } from '../dtos/create-patient.dto';
import { FilterPatientDto } from '../dtos/filter-patient.dto';
import { Patient } from '../entities/patient.entity';
import { PatientService } from '../services/patient.service';
import { AuthenticatedRequest } from '../../../common/interfaces/authenticated-request.interface';

@Controller('patients')
@ApiTags('Patient')
@ApiBearerAuth()
export class PatientController {
  constructor(
    private readonly patientService: PatientService,
    private readonly userService: UserService,
  ) {}

  @RequiredRole(UserRole.Staff)
  @Get()
  async findAll(@Query() query: FilterPatientDto): Promise<Patient[]> {
    return await this.patientService.findBy(query);
  }

  @RequiredRole(UserRole.Staff)
  @Get(':patientId')
  async findOne(@Param('patientId') patientId: string): Promise<Patient> {
    return await this.patientService.findOneBy('patientId', patientId);
  }

  @RequiredRole(UserRole.User)
  @Get('me')
  async findByMe(@Req() req: AuthenticatedRequest): Promise<Patient> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User ID not found in request');
    }

    return await this.patientService.findOneByUserId(userId);
  }

  @Post()
  async create(@Body() createPatientDto: CreatePatientDto): Promise<string> {
    const user = await this.userService.findOneBy({
      userId: createPatientDto.userId,
    });

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
