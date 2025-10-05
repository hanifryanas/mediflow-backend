import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'modules/employee/entities/employee.entity';
import { EmployeeDepartment } from 'modules/employee/enums/employee-department.enum';
import { User } from 'modules/user/entities/user.entity';
import { UserGenderType } from 'modules/user/enums/user-gender.enum';
import { UserRole } from 'modules/user/enums/user-role.enum';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';

@Injectable()
export class UserSuperAdminSeeder implements Seeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) { }

  async seed() {
    const existingSuperAdminUser = await this.userRepository.findOne({ where: { userName: 'superadmin' } });
    if (existingSuperAdminUser) return;

    const superAdminUser: Partial<User> = {
      identityNumber: faker.string.numeric(16),
      email: 'superadmin@mail.com',
      userName: 'superadmin',
      password: 'superadmin',
      firstName: 'Super',
      lastName: 'Admin',
      gender: UserGenderType.Male,
      role: UserRole.SuperAdmin,
      phoneNumber: faker.phone.number().replace(/\D/g, '').slice(0, 10),
      dateOfBirth: faker.date.birthdate({ min: 1970, max: 2000, mode: 'year' }),
    }

    const user = this.userRepository.create(superAdminUser);
    const createdUser = await this.userRepository.save(user);

    const superAdminEmployee: Partial<Employee> = {
      user: createdUser,
      startDate: new Date(),
      department: EmployeeDepartment.BackOffice
    }

    const employee = this.employeeRepository.create(superAdminEmployee);
    await this.employeeRepository.save(employee);
  }

  async drop() {
    await this.userRepository.delete({ userName: 'superadmin' });
  }
}