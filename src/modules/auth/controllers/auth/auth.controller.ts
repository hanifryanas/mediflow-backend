import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LoginDto } from 'modules/auth/dtos/login.dto';
import { JwtAuthGuard } from 'modules/auth/guards/jwt.guard';
import { ISigninData } from 'modules/auth/interfaces/signin-data.interface';
import { AuthService } from 'modules/auth/services/auth/auth.service';
import { CreateUserDto } from 'modules/user/dtos/create-user-dto';
import { User } from 'modules/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post('/signup')
  async signup(createUserDto: CreateUserDto): Promise<ISigninData> {
    return this.authService.signup(createUserDto);
  }

  @Post('/login')
  async login(loginDto: LoginDto): Promise<ISigninData> {
    return this.authService.login(loginDto);
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req): Promise<User> {
    const userId = req.user.id;
    return this.authService.me(userId);
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req): Promise<void> {
    const userId = req.user.id;
    return this.authService.logout(userId);
  }
}
