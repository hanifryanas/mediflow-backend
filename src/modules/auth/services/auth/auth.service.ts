import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'modules/auth/dtos/login.dto';
import { ISigninData } from 'modules/auth/interfaces/signin-data.interface';
import { CreateUserDto } from 'modules/user/dtos/create-user-dto';
import { User } from 'modules/user/entities/user.entity';
import { UserTokenType } from 'modules/user/enums/user-token.enum';
import { UserTokenService } from 'modules/user/services/user-token.service';
import { UserService } from 'modules/user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly userTokenService: UserTokenService,
  ) { }

  async login(loginDto: LoginDto): Promise<ISigninData> {
    const validatedUser = await this.userService.validateUserCredential(loginDto);

    const createdAccessToken = this.jwtService.sign(validatedUser);

    await this.userTokenService.createRefreshToken(validatedUser.userId);

    const signinData: ISigninData = {
      ...validatedUser,
      accessToken: createdAccessToken,
    };

    return signinData;
  }

  async signup(createUserDto: CreateUserDto): Promise<ISigninData> {
    await this.userService.create(createUserDto);

    const loginDto: LoginDto = {
      emailOrUsername: createUserDto.userName,
      password: createUserDto.password,
    };

    return this.login(loginDto);
  }

  async me(userId: string): Promise<User> {
    const user = await this.userService.findOneBy({ userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async logout(userId: string): Promise<void> {
    await this.userTokenService.removeTokensByUserId(userId, UserTokenType.RefreshToken);
  }
}
