import { IsEnum, IsOptional } from 'class-validator';
import { InsuranceProviderType } from '../enums';

export class FilterPatientDto {
  @IsOptional()
  @IsEnum(InsuranceProviderType)
  insuranceProvider?: InsuranceProviderType;
}