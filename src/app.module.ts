
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig, tokenConfig } from 'config';
import { PatientModule } from 'modules/patient/patient.module';
import { UserModule } from 'modules/user/user.module';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        databaseConfig,
        tokenConfig,
      ],
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
