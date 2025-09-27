import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequiredRole } from 'common/decorators/required-role.decorator';
import { UserRole } from 'modules/user/enums/user-role.enum';
import { UserService } from 'modules/user/services/user.service';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { Employee } from '../entities/employee.entity';
import { EmployeeService } from '../services/employee.service';

@Controller('employees')
@ApiTags('Employees')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly userService: UserService,
  ) { }

  @RequiredRole(UserRole.Admin)
  @Get()
  async findAll(): Promise<Employee[]> {
    return this.employeeService.findAll();
  }

  @RequiredRole(UserRole.Staff)
  @Get('me')
  async findOne(@Req() req: any): Promise<Employee> {
    const userId = req.user.id as string;
    return this.employeeService.findOneByUserId(userId);
  }

  @RequiredRole(UserRole.Admin)
  @Get(':employeeId')
  async findOneById(@Param('employeeId') employeeId: number): Promise<Employee> {
    return this.employeeService.findOneBy('employeeId', employeeId);
  }

  @RequiredRole(UserRole.SuperAdmin)
  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto): Promise<number> {
    const user = await this.userService.findOneBy({ userId: createEmployeeDto.userId });

    const createEmployee = {
      ...createEmployeeDto,
      user: user,
    };

    const createdEmployeeId = await this.employeeService.create(createEmployee);

    await this.userService.updateUserRole(user.userId, createEmployeeDto.role);

    return createdEmployeeId;
  }

  @RequiredRole(UserRole.Staff)
  @Delete('me')
  async deleteByUserId(@Req() req: any): Promise<void> {
    const userId = req.user.id as string;

    await this.employeeService.deleteByUserId(userId);

    await this.userService.updateUserRole(userId, UserRole.User);
  }

  @RequiredRole(UserRole.Admin)
  @Delete(':employeeId')
  async delete(@Param('employeeId') employeeId: number): Promise<void> {
    await this.employeeService.delete(employeeId);
  }
}