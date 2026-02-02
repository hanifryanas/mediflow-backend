import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Day } from '../../../common/enums/day.enum';

export class UpsertNurseScheduleItemDto {
  @IsEnum(Day)
  day: Day;

  @IsEnum(Day)
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in HH:mm format',
  })
  startTime: string;

  @IsEnum(Day)
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be in HH:mm format',
  })
  endTime: string;
}

export class UpsertNurseScheduleDto {
  @IsString()
  nurseId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertNurseScheduleItemDto)
  schedules: UpsertNurseScheduleItemDto[];
}
