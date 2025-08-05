
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { tokenConfig } from 'config';
import { dataSourceOptions } from 'database/data-source';
import 'dotenv/config';
import { PatientModule, UserModule } from 'modules';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
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
    TypeOrmModule.forRoot(dataSourceOptions),
    PatientModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
