import { Controller, Get, Post, Req } from '@nestjs/common';
import { LoginDto } from 'modules/auth/dtos/login.dto';
import { ISigninData } from 'modules/auth/interfaces/signin-data.interface';
import { AuthService } from 'modules/auth/services/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/login')
  async login(loginDto: LoginDto): Promise<ISigninData> {
    return this.authService.login(loginDto);
  }

  @Get('/me')
  async getProfile(@Req() req): Promise<void> {
    const userId = req.user.id;

    return userId;
  }

  @Post('/logout')
  async signout(userId: string): Promise<void> {
    return this.authService.signout(userId);
  }
}
