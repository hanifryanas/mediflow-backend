import { faker } from '@faker-js/faker';
import { InjectRepository } from '@nestjs/typeorm';
import { Day } from 'common/enums/day.enum';
import { Employee } from 'modules/employee/entities/employee.entity';
import { EmployeeDepartment } from 'modules/employee/enums/employee-department.enum';
import { NurseSchedule } from 'modules/nurse/entities/nurse-schedule.entity';
import { Nurse } from 'modules/nurse/entities/nurse.entity';
import { User } from 'modules/user/entities/user.entity';
import { UserGenderType } from 'modules/user/enums/user-gender.enum';
import { UserRole } from 'modules/user/enums/user-role.enum';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';

export class NurseSeeder implements Seeder {
  private generatedNurseUsers: Partial<User>[] = Array.from({ length: 50 }, () => {
    const gender = faker.person.sexType() as UserGenderType;
    const firstName = faker.person.firstName(gender);
    const lastName = faker.person.lastName(gender);
    const base = `${firstName}${lastName}`.toLowerCase().slice(0, 15);
    return {
      identityNumber: faker.string.numeric(16),
      email: `${base}@mail.com`,
      userName: base,
      password: base,
      firstName: firstName,
      lastName: lastName,
      gender,
      role: faker.helpers.arrayElement([UserRole.Staff, UserRole.Admin]),
      phoneNumber: `628${faker.string.numeric(10)}`,
      dateOfBirth: faker.date.birthdate({ min: 1970, max: 2000, mode: 'year' }),
    };
  });

  private generatedNurseEmployeeMap: Map<string, Partial<Employee>> = new Map(this.generatedNurseUsers.map(user => [user.userName!, {
    startDate: faker.date.past({ years: 5 }),
    department: faker.helpers.arrayElement(
      Object.values(EmployeeDepartment).filter(
        dept => ![EmployeeDepartment.BackOffice, EmployeeDepartment.FrontOffice, EmployeeDepartment.Pharmacy].includes(dept)
      )),
  }]));


  private generatedNurseScheduleMap: Map<string, Partial<NurseSchedule>[]> = new Map(
    this.generatedNurseUsers.map(user => {
      const schedules: Partial<NurseSchedule>[] = [];
      const numberOfSchedules = faker.number.int({ min: 4, max: 5 });
      const days = faker.helpers.arrayElements(Object.values(Day), numberOfSchedules);
      days.forEach(day => {
        const startHour = faker.number.int({ min: 0, max: 15 });
        const endHour = startHour + faker.number.int({ min: 8, max: 9 });
        schedules.push({
          day,
          startTime: `${startHour}:00`,
          endTime: `${endHour}:00`,
        });
      });

      return [user.userName!, schedules];
    })
  );

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Nurse)
    private readonly nurseRepository: Repository<Nurse>,
    @InjectRepository(NurseSchedule)
    private readonly nurseScheduleRepository: Repository<NurseSchedule>,
  ) { }

  async seed() {
    const existingNurses = await this.nurseRepository.count();
    const isNursesExist = existingNurses > 0;
    if (isNursesExist) return;

    const createdNurseUsers = await Promise.all(this.generatedNurseUsers.map(async user => await this.userRepository.save((user))));

    const createdEmployees = await Promise.all(createdNurseUsers.map(async user => {
      const employeeData = this.generatedNurseEmployeeMap.get(user.userName!);
      const employee = this.employeeRepository.create({
        ...employeeData,
        user,
      });
      return await this.employeeRepository.save(employee);
    }));

    const createdNurses = await Promise.all(createdEmployees.map(async employee => {
      const nurse = this.nurseRepository.create({
        employee,
      });
      return await this.nurseRepository.save(nurse);
    }));

    const nurseSchedules: Partial<NurseSchedule>[] = [];
    createdNurses.forEach(nurse => {
      const schedules = this.generatedNurseScheduleMap.get(nurse.employee.user.userName!);
      schedules?.forEach(schedule => {
        nurseSchedules.push({
          ...schedule,
          nurse,
        });
      });
    });

    await Promise.all(nurseSchedules.map(async schedule => await this.nurseScheduleRepository.save(this.nurseScheduleRepository.create(schedule))));
  }

  async drop() {
    await this.userRepository.delete(this.generatedNurseUsers);
  }

}