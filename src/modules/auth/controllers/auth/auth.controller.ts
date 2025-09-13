import { Body, ClassSerializerInterceptor, Controller, Get, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDataDto } from 'modules/auth/dtos/login-data.dto';
import { LoginDto } from 'modules/auth/dtos/login.dto';
import { JwtAuthGuard } from 'modules/auth/guards/jwt.guard';
import { AuthService } from 'modules/auth/services/auth/auth.service';
import { CreateUserDto } from 'modules/user/dtos/create-user-dto';
import { User } from 'modules/user/entities/user.entity';

@Controller('auth')
@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<LoginDataDto> {
    return this.authService.signup(createUserDto);
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<LoginDataDto> {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req): Promise<User> {
    const userId = req.user.id;
    return this.authService.me(userId);
  }

  @ApiBearerAuth()
  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req): Promise<void> {
    const userId = req.user.id;
    return this.authService.logout(userId);
  }
}
