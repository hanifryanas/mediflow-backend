import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync } from 'bcryptjs';
import { LoginDto } from 'modules/auth/dtos/login.dto';
import { ISigninData } from 'modules/auth/interfaces/signin-data.interface';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user-dto';
import { UpdateUserDto } from '../dtos/update-user-dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findBy(partialUser: Partial<User>): Promise<User[]> {
    return await this.userRepository.findBy(partialUser);
  }

  async findOneBy(partialUser: Partial<User>, selection?: (keyof User)[]): Promise<User> {
    const user = await this.userRepository.findOne({ where: partialUser, select: selection });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  async findOneByEmailOrUsername(identifier: string, selection?: (keyof User)[]): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [
        { email: identifier },
        { userName: identifier },
      ],
      select: selection,
    });

    if (!user) {
      throw new NotFoundException(`User with email or username ${identifier} not found`);
    }

    return user;
  }

  async validateUserCredential(loginDto: LoginDto): Promise<ISigninData> {
    const user = await this.findOneByEmailOrUsername(loginDto.emailOrUsername, ['userId', 'userName', 'password']);

    if (!user) {
      throw new UnauthorizedException(`User with email or username ${loginDto.emailOrUsername} is not registered`);
    }

    const isPasswordValid = compareSync(loginDto.password, user?.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(`Invalid password for user ${loginDto.emailOrUsername}`);
    }

    const signinData: ISigninData = {
      userId: user.userId,
      username: user.userName,
    };

    return signinData;
  }

  async create(createUserDto: CreateUserDto): Promise<string> {
    const user = this.userRepository.create(createUserDto);

    const createdUser = await this.userRepository.save(user);

    if (!createdUser) {
      throw new BadRequestException('User creation failed');
    }

    return createdUser.userId;
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<void> {
    const result = await this.userRepository.update(userId, updateUserDto);

    if (!result.affected) {
      throw new BadRequestException(`Failed to update user with ID ${userId}`);
    }
  }

  async delete(userId: string): Promise<void> {
    const result = await this.userRepository.delete(userId);

    if (!result.affected) {
      throw new BadRequestException(`Failed to delete user with ID ${userId}`);
    }
  }
}
