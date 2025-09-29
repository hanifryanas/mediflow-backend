import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Put, Query, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RequiredRole } from 'common/decorators/required-role.decorator';
import { UserRole } from 'modules/user/enums/user-role.enum';
import { FilterNurseScheduleDto } from '../dtos/filter-nurse-schedule.dto';
import { UpsertNurseScheduleDto } from '../dtos/upsert-nurse-schedule.dto';
import { NurseSchedule } from '../entities/nurse-schedule.entity';
import { NurseScheduleService } from '../services/nurse-schedule.service';

@Controller('nurses/schedules')
@ApiTags('Nurse-Schedule')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class NurseScheduleController {
  constructor(
    private readonly nurseScheduleService: NurseScheduleService,
  ) { }

  @RequiredRole(UserRole.User)
  @Get()
  @ApiQuery({ name: 'nurseId', required: false, type: String })
  @ApiQuery({ name: 'day', required: false, type: String })
  @ApiQuery({ name: 'startTime', required: false, type: String })
  @ApiQuery({ name: 'endTime', required: false, type: String })
  async findAll(@Query() filterNurseScheduleDto: FilterNurseScheduleDto): Promise<NurseSchedule[]> {
    return this.nurseScheduleService.findBy(filterNurseScheduleDto);
  }

  @RequiredRole(UserRole.Admin)
  @Put()
  async update(@Body() upsertNurseScheduleDto: UpsertNurseScheduleDto): Promise<void> {
    return await this.nurseScheduleService.upsert(upsertNurseScheduleDto);
  }

  @RequiredRole(UserRole.Staff)
  @Put('me')
  async updateMe(@Req() req: any, @Body() upsertNurseScheduleDto: UpsertNurseScheduleDto): Promise<void> {
    const userId = req.user.id as string;

    return await this.nurseScheduleService.upsertByUserId(userId, upsertNurseScheduleDto);
  }

  @RequiredRole(UserRole.Admin)
  @Delete()
  @ApiQuery({ name: 'nurseId', required: true, type: String })
  async deleteByNurseId(@Query('nurseId') nurseId: string): Promise<void> {
    return await this.nurseScheduleService.deleteByNurseId(nurseId);
  }

  @RequiredRole(UserRole.Admin)
  @Delete(':nurseScheduleId')
  async deleteById(@Param('nurseScheduleId') nurseScheduleId: number): Promise<void> {
    return await this.nurseScheduleService.delete(nurseScheduleId);
  }
}
