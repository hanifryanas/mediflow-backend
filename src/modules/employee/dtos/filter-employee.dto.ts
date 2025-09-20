import { ApiPropertyOptional } from '@nestjs/swagger';
import { FilterUserDto } from 'modules/user/dtos/filter-user.dto';

export class FilterEmployeeDto extends FilterUserDto {
  @ApiPropertyOptional({
    description: 'Filter by start date (YYYY-MM-DD)',
    example: '2023-01-01',
  })
  startDate?: string;
}