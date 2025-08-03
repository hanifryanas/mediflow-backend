import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from '../entities/user.entity';
import { UserGenderType } from '../enums/user-gender.enum';

export class CreateUserDto implements Partial<User> {
  @IsString()
  @IsNotEmpty()
  identityNumber: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserGenderType)
  @IsNotEmpty()
  gender: UserGenderType;

  @IsDate()
  @IsNotEmpty()
  dateOfBirth: Date;

  @IsString()
  @IsOptional()
  address?: string;
}