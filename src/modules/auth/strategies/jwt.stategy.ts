import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { LoginDataDto } from '../dtos/login-data.dto';
import { UserRole } from 'modules/user/enums/user-role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('token.accessTokenSecret'),
    });
  }

  async validate(payload: { userId: string; username: string, role: UserRole }): Promise<LoginDataDto> {
    return { userId: payload.userId, username: payload.username, role: payload.role };
  }
}