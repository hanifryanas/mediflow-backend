import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Patient } from '../entities';
import { InsuranceProviderType } from '../enums';

export class CreatePatientDto implements Partial<Patient> {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(InsuranceProviderType)
  @IsOptional()
  insuranceProvider?: InsuranceProviderType;

  @IsString()
  @IsOptional()
  insurancePolicyNumber?: string;
}