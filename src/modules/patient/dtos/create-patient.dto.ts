import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Patient } from '../entities';
import { InsuranceProviderType } from '../enums';

export class CreatePatientDto implements Partial<Patient> {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({
    enum: InsuranceProviderType,
    enumName: 'InsuranceProviderType',
  })
  @IsEnum(InsuranceProviderType)
  @IsOptional()
  insuranceProvider?: InsuranceProviderType;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  insurancePolicyNumber?: string;
}