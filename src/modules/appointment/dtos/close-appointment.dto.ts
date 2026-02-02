import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Status } from '../../../common/enums/status.enum';

export class CloseAppointmentDto {
  @ApiProperty({
    example: Status.Completed,
    enum: Status,
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @ApiProperty({
    example: 'Diagnosis details',
  })
  @IsString()
  diagnosis?: string;

  @ApiProperty({
    example: 'Notes details',
  })
  @IsString()
  notes?: string;

  @ApiProperty({
    example: 'OB314',
  })
  @IsString()
  room?: string;

  @ApiProperty({
    description: 'List of nurse IDs attending the appointment',
    required: false,
    isArray: true,
  })
  @IsString({ each: true })
  nurseIds?: string[];
}
