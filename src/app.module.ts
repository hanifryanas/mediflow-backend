
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig, tokenConfig } from 'config';
import 'dotenv/config';
import { PatientModule, UserModule } from 'modules';
import { join } from 'path';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        databaseConfig,
        tokenConfig,
      ],
      cache: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('token.accessTokenSecret'),
        signOptions: {
          expiresIn: `${configService.get<number>('token.accessTokenExpiration')}h`,
        },
      }),
      inject: [ConfigService],
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
    PatientModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
