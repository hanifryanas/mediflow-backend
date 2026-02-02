import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDataDto } from '../dtos/login-data.dto';
import { LoginDto } from '../dtos/login.dto';
import { CreateUserDto } from '../../user/dtos/create-user-dto';
import { User } from '../../user/entities/user.entity';
import { UserTokenType } from '../../user/enums/user-token.enum';
import { UserTokenService } from '../../user/services/user-token.service';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly userTokenService: UserTokenService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginDataDto> {
    const validatedUser =
      await this.userService.validateUserCredential(loginDto);

    const createdAccessToken = this.jwtService.sign(validatedUser);

    await this.userTokenService.createRefreshToken(validatedUser.userId);

    const signinData: LoginDataDto = {
      ...validatedUser,
      accessToken: createdAccessToken,
    };

    return signinData;
  }

  async signup(createUserDto: CreateUserDto): Promise<LoginDataDto> {
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
    await this.userTokenService.removeTokensByUserId(
      userId,
      UserTokenType.RefreshToken,
    );
  }
}
