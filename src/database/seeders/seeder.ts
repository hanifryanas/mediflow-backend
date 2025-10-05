import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from 'config/database.config';
import { Doctor } from 'modules/doctor/entities/doctor.entity';
import { Employee } from 'modules/employee/entities/employee.entity';
import { Nurse } from 'modules/nurse/entities/nurse.entity';
import { User } from 'modules/user/entities/user.entity';
import { seeder } from 'nestjs-seeder';
import { join } from 'path';
import { EmployeeAdminSeeder } from './employee-admin.seeder';
import { UserSuperAdminSeeder } from './user-super-admin.seeder';

seeder({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        database: configService.get<string>('database.database'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        entities: [join(__dirname, '../../modules/**/entities/*.entity{.ts,.js}')],
        migrationsRun: false,
        synchronize: false,
      }),
    }),
    TypeOrmModule.forFeature([
      User,
      Employee,
      Doctor,
      Nurse,
    ]),
  ],
}).run([
  UserSuperAdminSeeder,
  EmployeeAdminSeeder,
])