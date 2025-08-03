import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { User } from '../entities/user.entity';

export class FilterUserDto implements Partial<User> {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  identityNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}