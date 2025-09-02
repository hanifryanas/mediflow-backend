import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { FilterUserDto } from 'modules/user/dtos/filter-user.dto';
import { InsuranceProviderType } from '../enums/insurance-provider.enum';

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