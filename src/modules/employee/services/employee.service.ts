import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) { }

  async findAll(): Promise<Employee[]> {
    return await this.employeeRepository.find({ relations: ['user'] });
  }

  async findBy(partialEmployee: Partial<Employee>): Promise<Employee[]> {
    return await this.employeeRepository.findBy(partialEmployee);
  }

  async findOneByUserId(userId: string, selection?: (keyof Employee)[]): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ where: { user: { userId } }, select: selection, relations: ['user'] });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  async findOneBy(employeeField: keyof Employee, employeeValue: Employee[keyof Employee], selection?: (keyof Employee)[]): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ where: { [employeeField]: employeeValue }, select: selection, relations: ['user'] });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  async create(employee: Partial<Employee>): Promise<string> {
    const createEmployeeDto = this.employeeRepository.create(employee);
    const createdEmployee = await this.employeeRepository.save(createEmployeeDto);

    if (!createdEmployee) {
      throw new BadRequestException('Failed to create employee');
    }

    return createdEmployee.employeeId;
  }

  async deleteByUserId(userId: string): Promise<void> {
    const result = await this.employeeRepository.delete({ user: { userId } });

    if (!result.affected) {
      throw new BadRequestException(`Failed to delete employee for user with ID ${userId}`);
    }
  }

  async delete(employeeId: number): Promise<void> {
    const result = await this.employeeRepository.delete(employeeId);

    if (!result.affected) {
      throw new BadRequestException(`Failed to delete employee with ID ${employeeId}`);
    }
  }
}