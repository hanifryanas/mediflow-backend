import { Body, ClassSerializerInterceptor, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { isNullOrUndefined } from 'common/functions';
import { CreateUserDto } from '../dtos/create-user-dto';
import { FilterUserDto } from '../dtos/filter-user.dto';
import { UpdateUserDto } from '../dtos/update-user-dto';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';


@Controller('users')
@ApiTags('Users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
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
