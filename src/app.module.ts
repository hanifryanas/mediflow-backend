
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
    TypeOrmModule.forRoot(dataSourceOptions),
    PatientModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
