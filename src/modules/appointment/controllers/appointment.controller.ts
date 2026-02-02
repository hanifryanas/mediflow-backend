import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AppointmentService } from '../services/appoinment.service';
import { RequiredRole } from '../../../common/decorators/required-role.decorator';
import { UserRole } from '../../user/enums/user-role.enum';
import { Appointment } from '../entities/appointment.entity';
import { CreateAppointmentDto } from '../dtos/create-appointment.dto';
import { CloseAppointmentDto } from '../dtos/close-appointment.dto';
import { UpdateAppointmentTimeDto } from '../dtos/update-appointment-time.dto';

@Controller('appointments')
@ApiTags('Appointment')
@ApiBearerAuth()
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @RequiredRole(UserRole.User)
  @Get(':appointmentId')
  async findById(
    @Param('appointmentId') appointmentId: string,
  ): Promise<Appointment> {
    return this.appointmentService.findById(appointmentId);
  }

  @RequiredRole(UserRole.User)
  @Get('patients/:patientId')
  async findByPatient(
    @Param('patientId') patientId: string,
  ): Promise<Appointment[]> {
    return this.appointmentService.findByPatientId(patientId);
  }

  @RequiredRole(UserRole.Staff)
  @Get('doctors/:doctorId')
  async findByDoctor(
    @Param('doctorId') doctorId: string,
  ): Promise<Appointment[]> {
    return this.appointmentService.findByDoctorId(doctorId);
  }

  @RequiredRole(UserRole.User)
  @Post()
  async create(
    @Body() createAppoinmentDto: CreateAppointmentDto,
  ): Promise<string> {
    return this.appointmentService.create(createAppoinmentDto);
  }

  @RequiredRole(UserRole.Staff)
  @Put(':appointmentId')
  async update(
    @Param('appointmentId') appointmentId: string,
    @Body() closeAppoinmentDto: CloseAppointmentDto,
  ): Promise<void> {
    return this.appointmentService.update(appointmentId, closeAppoinmentDto);
  }

  @RequiredRole(UserRole.User)
  @Put(':appointmentId/reschedule')
  async reschedule(
    @Param('appointmentId') appointmentId: string,
    @Body() updateAppoinmentTimeDto: UpdateAppointmentTimeDto,
  ): Promise<void> {
    return this.appointmentService.update(
      appointmentId,
      updateAppoinmentTimeDto,
    );
  }

  @RequiredRole(UserRole.Staff)
  @Delete(':appointmentId')
  async delete(@Param('appointmentId') appointmentId: string): Promise<void> {
    return this.appointmentService.delete(appointmentId);
  }
}
