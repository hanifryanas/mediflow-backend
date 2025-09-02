import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@mail.com',
  })
  @IsString()
  @IsNotEmpty()
  emailOrUsername: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
