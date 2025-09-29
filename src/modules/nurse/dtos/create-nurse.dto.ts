import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateEmployeeDto } from 'modules/employee/dtos/create-employee.dto';

export class CreateNurseDto extends CreateEmployeeDto {
  @ApiProperty({ example: 'S.Kep' })
  @IsString()
  title?: string;
}
