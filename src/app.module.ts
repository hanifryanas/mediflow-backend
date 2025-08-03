
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'database/data-source';
import 'dotenv/config';
import { PatientModule, UserModule } from 'modules';
@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    PatientModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
