import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'modules/user/user.module';
import { AuthController } from './controllers/auth/auth.controller';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AuthService } from './services/auth/auth.service';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('token.accessTokenSecret'),
        signOptions: {
          expiresIn: `${configService.get<number>('token.accessTokenExpiration')}h`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtAuthGuard],
  controllers: [AuthController]
})
export class AuthModule { }
