import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from './common/guards/jwt.guard';
import { RequiredRoleGuard } from './common/guards/required-role.guard';
import { PatientModule } from './modules/patient/patient.module';
import { UserModule } from './modules/user/user.module';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { NurseModule } from './modules/nurse/nurse.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { databaseConfig, tokenConfig } from './config';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RequiredRoleGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      inject: [Reflector],
      useFactory: (reflector: Reflector) =>
        new ClassSerializerInterceptor(
          reflector /*, { excludeExtraneousValues: true } */,
        ),
    },
  ],
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig, tokenConfig],
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        database: configService.get<string>('database.database'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        entities: [join(__dirname, './modules/**/entities/*.entity{.ts,.js}')],
        migrations: [join(__dirname, './migrations/*.ts')],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    PatientModule,
    EmployeeModule,
    DoctorModule,
    NurseModule,
    AppointmentModule,
  ],
})
export class AppModule {}
