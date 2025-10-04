import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEmployeeDto } from 'modules/employee/dtos/create-employee.dto';
import { EmployeeDepartment } from 'modules/employee/enums/employee-department.enum';
import { CreateUserDto } from 'modules/user/dtos/create-user-dto';
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
  ) { }

  async seed() {
    const existingSuperAdminUser = await this.userRepository.findOne({ where: { userName: 'superadmin' } });
    if (existingSuperAdminUser) return;

    const superAdminUser: CreateUserDto = {
      identityNumber: faker.string.numeric(16),
      email: 'superadmin@mail.com',
      userName: 'superadmin',
      password: 'superadmin',
      firstName: 'Super',
      lastName: 'Admin',
      gender: UserGenderType.Male,
      phoneNumber: faker.phone.number().replace(/\D/g, '').slice(0, 10),
      dateOfBirth: faker.date.birthdate({ min: 1970, max: 2000, mode: 'year' }),
    }

    const user = this.userRepository.create(superAdminUser);
    const createdUser = await this.userRepository.save(user);

    const superAdminEmployee: CreateEmployeeDto = {
      userId: createdUser.userId,
      startDate: new Date(),
      role: UserRole.SuperAdmin,
      department: EmployeeDepartment.BackOffice
    }

    const userEmployee = this.userRepository.create(superAdminEmployee);
    await this.userRepository.save(userEmployee);
  }

  async drop() {
    await this.userRepository.delete({ userName: 'superadmin' });
  }
}