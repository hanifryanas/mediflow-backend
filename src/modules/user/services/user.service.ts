import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  async findOneBy(partialUser: Partial<User>, selection?: (keyof User)[]): Promise<User | null> {
    return await this.userRepository.findOne({ where: partialUser, select: selection });
  }

  async findOneByEmailOrUsername(identifier: string, selection?: (keyof User)[]): Promise<User | null> {
    return await this.userRepository.findOne({
      where: [
        { email: identifier },
        { userName: identifier },
      ],
      select: selection,
    });
  }

  async findBy(partialUser: Partial<User>): Promise<User[]> {
    return await this.userRepository.findBy(partialUser);
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

    return createdUser.userId;
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<void> {
    await this.userRepository.update(userId, updateUserDto);
  }

  async delete(userId: string): Promise<void> {
    await this.userRepository.delete(userId);
  }
}
