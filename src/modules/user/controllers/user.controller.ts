import { Body, ClassSerializerInterceptor, Controller, Delete, Get, MethodNotAllowedException, NotFoundException, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { compareSync } from 'bcryptjs';
import { isNullOrUndefined } from 'common/functions';
import { CreateUserDto, FilterUserDto, LoginUserDto, LogoutUserDto, UpdateUserDto } from '../dtos';
import { User } from '../entities';
import { UserAuthService, UserService } from '../services';


@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userAuthService: UserAuthService,
  ) { }

  @Get()
  async findAll(@Query() query: FilterUserDto): Promise<User[]> {
    const filterUser: Partial<User> = {
      ...query,
    };

    return await this.userService.findBy(filterUser);
  }

  @Get(':userId')
  async findOne(@Param('userId') userId: string): Promise<User | null> {
    const user = await this.userService.findOneBy({ userId });

    if (isNullOrUndefined(user)) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<string> {
    return await this.userService.create(createUserDto);
  }

  @Post('/login')
  async login(@Body() loginDto: LoginUserDto): Promise<string> {
    const user = await this.userService.findOneBy({
      email: loginDto.emailOrUsername,
      userName: loginDto.emailOrUsername,
    }, ['userId', 'email', 'userName', 'password']);

    if (!user) {
      throw new MethodNotAllowedException(`User with email or username ${loginDto.emailOrUsername} is not registered`);
    }

    const isPasswordValid = compareSync(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new MethodNotAllowedException('Invalid password');
    }

    const accessToken = await this.userAuthService.login(user);

    if (isNullOrUndefined(accessToken)) {
      throw new MethodNotAllowedException('Login failed');
    }

    return accessToken;
  }

  @Post('/logout')
  async logout(@Body() logoutUserDto: LogoutUserDto): Promise<void> {
    await this.userAuthService.logout(logoutUserDto.userId);
  }

  @Put(':userId')
  async update(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto): Promise<void> {
    const user = await this.userService.findOneBy({ userId });

    if (isNullOrUndefined(user)) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    await this.userService.update(userId, updateUserDto);
  }

  @Delete(':userId')
  async delete(@Param('userId') userId: string): Promise<void> {
    const user = await this.userService.findOneBy({ userId });

    if (isNullOrUndefined(user)) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    await this.userService.delete(userId);
  }
}
