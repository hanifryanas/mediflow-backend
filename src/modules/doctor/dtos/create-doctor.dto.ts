import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateEmployeeDto } from '../../employee/dtos/create-employee.dto';

export class CreateDoctorDto extends CreateEmployeeDto {
  @ApiProperty({ example: 'Sp.OG-KFER' })
  @IsString()
  title?: string;
}
