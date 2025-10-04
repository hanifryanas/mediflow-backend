import { Body, ClassSerializerInterceptor, Controller, Get, Post, Put, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'common/decorators/public.decorator';
import { LoginDataDto } from 'modules/auth/dtos/login-data.dto';
import { LoginDto } from 'modules/auth/dtos/login.dto';
import { CreateUserDto } from 'modules/user/dtos/create-user-dto';
import { UpdateUserDto } from 'modules/user/dtos/update-user-dto';
import { User } from 'modules/user/entities/user.entity';
import { UserService } from 'modules/user/services/user.service';
import { AuthService } from '../services/auth.service';

@Controller('auth')
@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) { }

  @Public()
  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<LoginDataDto> {
    return this.authService.signup(createUserDto);
  }

  @Public()
  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<LoginDataDto> {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @Get('/me')
  async getProfile(@Req() req): Promise<User> {
    const userId = req.user.userId;
    return this.authService.me(userId);
  }

  @ApiBearerAuth()
  @Put('/me')
  async updateProfile(@Req() req, @Body() updateUserDto: UpdateUserDto): Promise<void> {
    const userId = req.user.userId;
    return this.userService.update(userId, updateUserDto);
  }

  @ApiBearerAuth()
  @Post('/logout')
  async logout(@Req() req): Promise<void> {
    const userId = req.user.userId;
    return this.authService.logout(userId);
  }
}
