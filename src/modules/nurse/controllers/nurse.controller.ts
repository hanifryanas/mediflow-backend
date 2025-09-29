import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequiredRole } from 'common/decorators/required-role.decorator';
import { UserRole } from 'modules/user/enums/user-role.enum';
import { CreateNurseDto } from '../dtos/create-nurse.dto';
import { Nurse } from '../entities/nurse.entity';
import { NurseService } from '../services/nurse.service';

@Controller('nurses')
@ApiTags('Nurse')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class NurseController {
  constructor(
    private readonly nurseService: NurseService,
  ) { }

  @RequiredRole(UserRole.Admin)
  @Get()
  async findAll(): Promise<Nurse[]> {
    return this.nurseService.findAll();
  }

  @RequiredRole(UserRole.Staff)
  @Get('me')
  async findMe(@Req() req: any): Promise<Nurse> {
    const userId = req.user.id as string;
    return this.nurseService.findByUserId(userId);
  }

  @RequiredRole(UserRole.Admin)
  @Get(':nurseId')
  async findOneById(@Param('nurseId') nurseId: string): Promise<Nurse> {
    return this.nurseService.findById(nurseId);
  }

  @RequiredRole(UserRole.SuperAdmin)
  @Post()
  async create(@Body() createNurseDto: CreateNurseDto): Promise<string> {
    return this.nurseService.create(createNurseDto);
  }

  @RequiredRole(UserRole.Staff)
  @Put('me')
  async updateMe(@Req() req: any, @Body() updateNurseDto: CreateNurseDto): Promise<void> {
    const userId = req.user.id as string;
    await this.nurseService.update(userId, updateNurseDto);
  }

  @RequiredRole(UserRole.Admin)
  @Put(':nurseId')
  async update(@Param('nurseId') nurseId: string, @Body() updateNurseDto: CreateNurseDto): Promise<void> {
    await this.nurseService.update(nurseId, updateNurseDto);
  }

  @RequiredRole(UserRole.Admin)
  @Put(':nurseId')
  async delete(@Param('nurseId') nurseId: string): Promise<void> {
    return this.nurseService.delete(nurseId);
  }

  @RequiredRole(UserRole.Staff)
  @Put('me')
  async deleteMe(@Req() req: any): Promise<void> {
    const userId = req.user.id as string;
    return this.nurseService.deleteByUserId(userId);
  }

  @RequiredRole(UserRole.Admin)
  @Delete(':nurseId')
  async deleteById(@Param('nurseId') nurseId: string): Promise<void> {
    return this.nurseService.delete(nurseId);
  }

  @RequiredRole(UserRole.Staff)
  @Delete('me')
  async deleteMeByUserId(@Req() req: any): Promise<void> {
    const userId = req.user.id as string;
    return this.nurseService.deleteByUserId(userId);
  }
}