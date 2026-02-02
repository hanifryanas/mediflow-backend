import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { addHours } from 'date-fns';
import { Repository } from 'typeorm';
import { UserToken } from '../entities/user-token.entity';
import { UserTokenType } from '../enums/user-token.enum';

export class UserTokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
  ) {}

  private getRefreshTokenOptions(): JwtSignOptions {
    return {
      secret: this.configService.get<string>('token.refreshTokenSecret'),
      expiresIn: `${this.configService.get<number>('token.refreshTokenExpiration')}h`,
    };
  }

  private getExpirationDate(expireInHours: number): Date {
    return addHours(new Date(), expireInHours);
  }

  async createRefreshToken(userId: string): Promise<UserToken> {
    const tokenOptions = this.getRefreshTokenOptions();

    const expiredInHours = parseInt(tokenOptions.expiresIn as string, 10) || 0;

    const generatedRefreshToken = this.jwtService.sign(
      { userId },
      tokenOptions,
    );

    const userToken = this.userTokenRepository.create({
      user: { userId },
      token: generatedRefreshToken,
      type: UserTokenType.RefreshToken,
      expiredAt: this.getExpirationDate(expiredInHours),
    });

    return await this.userTokenRepository.save(userToken);
  }

  async removeTokensByUserId(
    userId: string,
    tokenType: UserTokenType,
  ): Promise<void> {
    await this.userTokenRepository.delete({
      user: { userId },
      type: tokenType,
    });
  }
}
