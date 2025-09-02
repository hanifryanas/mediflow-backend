import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { InsuranceProviderType } from '../enums/insurance-provider.enum';

export class CreatePatientInsuranceDto {
  @ApiProperty({
    enum: InsuranceProviderType,
    enumName: 'InsuranceProviderType',
  })
  @IsEnum(InsuranceProviderType)
  @IsNotEmpty()
  insuranceProvider: InsuranceProviderType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  policyNumber: string
}