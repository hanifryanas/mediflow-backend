import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import { isNullOrUndefined } from 'common/functions';
import { CreateUserDto, FilterUserDto, UpdateUserDto } from '../dtos';
import { User } from '../entities';
import { UserService } from '../services';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async findAll(@Query() query: FilterUserDto): Promise<User[]> {
    return await this.userService.findBy(query);
  }

  @Get(':userId')
  async findOne(@Param('userId') userId: string): Promise<User | null> {
    const user = await this.userService.findOneBy('userId', userId);

    if (isNullOrUndefined(user)) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<string> {
    return await this.userService.create(createUserDto);
  }

  @Put(':userId')
  async update(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto): Promise<void> {
    const user = await this.userService.findOneBy('userId', userId);

    if (isNullOrUndefined(user)) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    await this.userService.update(userId, updateUserDto);
  }

  @Delete(':userId')
  async delete(@Param('userId') userId: string): Promise<void> {
    const user = await this.userService.findOneBy('userId', userId);

    if (isNullOrUndefined(user)) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    await this.userService.delete(userId);
  }
}
