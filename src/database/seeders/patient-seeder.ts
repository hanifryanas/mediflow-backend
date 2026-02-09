import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { PatientInsurance } from '../../modules/patient/entities/patient-insurance.entity';
import { Patient } from '../../modules/patient/entities/patient.entity';
import { InsuranceProviderType } from '../../modules/patient/enums/insurance-provider.enum';
import { User } from '../../modules/user/entities/user.entity';
import { UserGenderType } from '../../modules/user/enums/user-gender.enum';

@Injectable()
export class PatientSeeder implements Seeder {
  private generatedPatientUsers: Partial<User>[] = Array.from(
    { length: 50 },
    () => {
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
        phoneNumber: `628${faker.string.numeric(10)}`,
        dateOfBirth: faker.date.birthdate({
          min: 1970,
          max: 2000,
          mode: 'year',
        }),
      };
    },
  );

  private generatedPatientInsurances: Partial<PatientInsurance>[] = Array.from(
    { length: 50 },
    (): Partial<PatientInsurance> => {
      return {
        insuranceProvider: faker.helpers.arrayElement(
          Object.values(InsuranceProviderType),
        ),
        policyNumber: faker.string.alphanumeric(10).toUpperCase(),
      };
    },
  );

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(PatientInsurance)
    private readonly patientInsuranceRepository: Repository<PatientInsurance>,
  ) {}

  async seed() {
    const existingPatients = await this.patientRepository.count();
    const isPatientsExist = existingPatients > 0;
    if (isPatientsExist) return;

    const createdPatientUsers = await Promise.all(
      this.generatedPatientUsers.map(
        async (user) =>
          await this.userRepository.save(this.userRepository.create(user)),
      ),
    );
    const createPatients: Partial<Patient>[] = createdPatientUsers.map(
      (user) => ({
        user: user,
      }),
    );

    const createdPatients = await Promise.all(
      createPatients.map(
        async (patient) =>
          await this.patientRepository.save(
            this.patientRepository.create(patient),
          ),
      ),
    );
    this.generatedPatientInsurances.forEach((insurance, index) => {
      insurance.patient = createdPatients[index % createdPatients.length];
    });

    await Promise.all(
      this.generatedPatientInsurances.map(
        async (insurance) =>
          await this.patientInsuranceRepository.save(
            this.patientInsuranceRepository.create(insurance),
          ),
      ),
    );
  }

  drop() {
    return this.userRepository.delete(this.generatedPatientUsers);
  }
}
