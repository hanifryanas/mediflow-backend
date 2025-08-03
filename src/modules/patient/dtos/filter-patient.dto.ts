import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { FilterUserDto } from 'modules/user/dtos';
import { InsuranceProviderType } from '../enums';

export class FilterPatientDto extends FilterUserDto {
  @ApiPropertyOptional({
    description: 'Filter by insurance provider type',
    enum: InsuranceProviderType,
    enumName: 'InsuranceProviderType',
  })
  @IsOptional()
  @IsEnum(InsuranceProviderType)
  insuranceProvider?: InsuranceProviderType;
}