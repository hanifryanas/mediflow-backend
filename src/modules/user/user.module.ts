import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers';
import { User, UserToken } from './entities';
import { UserAuthService, UserService, UserTokenService } from './services';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserToken]),
  ],
  providers: [ConfigService, UserService, UserAuthService, UserTokenService, JwtService],
  controllers: [UserController],
  exports: [UserService, UserAuthService, UserTokenService],
})
export class UserModule { }
