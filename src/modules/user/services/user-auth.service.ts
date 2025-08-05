import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities';
import { UserTokenType } from '../enums';
import { UserTokenService } from './user-token.service';

@Injectable()
export class UserAuthService {
  constructor(
    private readonly userTokenService: UserTokenService,
    private readonly jwtService: JwtService,
  ) { }

  async login(partialUser: Partial<User>): Promise<string> {
    if (!partialUser.email || !partialUser.userName || !partialUser.userId) return '';

    const createdAccessToken = await this.jwtService.signAsync({
      email: partialUser.email,
      userName: partialUser.userName,
    });

    await this.userTokenService.createRefreshToken(partialUser.userId);

    return createdAccessToken;
  }

  async logout(userId: string): Promise<void> {
    await this.userTokenService.removeTokensByUserId(userId, UserTokenType.RefreshToken);
  }
}