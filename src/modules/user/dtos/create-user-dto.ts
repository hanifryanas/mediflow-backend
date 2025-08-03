import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from '../entities/user.entity';
import { UserGenderType } from '../enums/user-gender.enum';

export class CreateUserDto implements Partial<User> {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  identityNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ enum: UserGenderType })
  @IsEnum(UserGenderType)
  @IsNotEmpty()
  gender: UserGenderType;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  dateOfBirth: Date;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string;
}