import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from '../../modules/employee/entities/employee.entity';
import { EmployeeDepartment } from '../../modules/employee/enums/employee-department.enum';
import { User } from '../../modules/user/entities/user.entity';
import { UserGenderType } from '../../modules/user/enums/user-gender.enum';
import { UserRole } from '../../modules/user/enums/user-role.enum';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';

@Injectable()
export class EmployeeAdminSeeder implements Seeder {
  private employeeUsers: Partial<User>[] = Object.values(
    EmployeeDepartment,
  ).map((dept) => ({
    identityNumber: faker.string.numeric(16),
    email: `${dept}admin@mail.com`,
    userName: `${dept}admin`,
    password: `${dept}admin`,
    firstName: dept.charAt(0).toUpperCase() + dept.slice(1),
    lastName: 'Admin',
    gender: faker.helpers.arrayElement(Object.values(UserGenderType)),
    role: UserRole.Admin,
    phoneNumber: `628${faker.string.numeric(10)}`,
    dateOfBirth: faker.date.birthdate({ min: 1970, max: 2000, mode: 'year' }),
  }));

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async seed() {
    const existingAdminUsers = await this.userRepository.findOne({
      where: { role: UserRole.Admin },
    });
    if (existingAdminUsers) return;

    const createdUsers = await Promise.all(
      this.employeeUsers.map(
        async (user) =>
          await this.userRepository.save(this.userRepository.create(user)),
      ),
    );

    const employeeAdmins: Partial<Employee>[] = createdUsers.map((user) => ({
      user,
      startDate: new Date(),
      department: Object.values(EmployeeDepartment).find(
        (dept) => `${dept}admin` === user.userName,
      ),
    }));

    await Promise.all(
      employeeAdmins.map(
        async (employee) =>
          await this.employeeRepository.save(
            this.employeeRepository.create(employee),
          ),
      ),
    );
  }

  async drop() {
    await this.userRepository.delete(this.employeeUsers);
  }
}
