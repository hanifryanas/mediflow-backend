import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequiredRole } from 'common/decorators/required-role.decorator';
import { UserRole } from 'modules/user/enums/user-role.enum';
import { CreateDoctorDto } from '../dtos/create-doctor.dto';
import { UpdateDoctorDto } from '../dtos/update-doctor.dto';
import { Doctor } from '../entities/doctor.entity';
import { DoctorService } from '../services/doctor.service';

@Controller('doctors')
@ApiTags('Doctor')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class DoctorController {
  constructor(
    private readonly doctorService: DoctorService,
  ) { }

  @RequiredRole(UserRole.Admin)
  @Get()
  async findAll(): Promise<Doctor[]> {
    return this.doctorService.findAll();
  }

  @RequiredRole(UserRole.Staff)
  @Get('me')
  async findMe(@Req() req: any): Promise<Doctor> {
    const userId = req.user.id as string;
    return this.doctorService.findByUserId(userId);
  }

  @RequiredRole(UserRole.Admin)
  @Get(':doctorId')
  async findOneById(@Param('doctorId') doctorId: string): Promise<Doctor> {
    return this.doctorService.findById(doctorId);
  }

  @RequiredRole(UserRole.SuperAdmin)
  @Post()
  async create(@Body() createDoctorDto: CreateDoctorDto): Promise<string> {
    return this.doctorService.create(createDoctorDto);
  }

  @RequiredRole(UserRole.Staff)
  @Put('me')
  async updateMe(@Req() req: any, @Body() updateDoctorDto: UpdateDoctorDto): Promise<void> {
    const userId = req.user.id as string;
    await this.doctorService.update(userId, updateDoctorDto);
  }

  @RequiredRole(UserRole.Admin)
  @Put(':doctorId')
  async update(@Param('doctorId') doctorId: string, @Body() updateDoctorDto: UpdateDoctorDto): Promise<void> {
    await this.doctorService.update(doctorId, updateDoctorDto);
  }

  @RequiredRole(UserRole.Admin)
  @Delete(':doctorId')
  async delete(@Param('doctorId') doctorId: string): Promise<void> {
    return this.doctorService.delete(doctorId);
  }

  @RequiredRole(UserRole.Staff)
  @Delete('me')
  async deleteMe(@Req() req: any): Promise<void> {
    const userId = req.user.id as string;
    return this.doctorService.deleteByUserId(userId);
  }
}