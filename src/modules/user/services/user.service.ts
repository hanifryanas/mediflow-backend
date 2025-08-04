import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '../dtos';
import { User } from '../entities';
import { UserTokenType } from '../enums';
import { UserTokenService } from './user-token.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly userTokenService: UserTokenService,
  ) { }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOneBy(partialUser: Partial<User>, selection?: (keyof User)[]): Promise<User | null> {
    return await this.userRepository.findOne({ where: partialUser, select: selection });
  }

  async findBy(partialUser: Partial<User>): Promise<User[]> {
    return await this.userRepository.findBy(partialUser);
  }

  async create(createUserDto: CreateUserDto): Promise<string> {
    const user = this.userRepository.create(createUserDto);

    const createdUser = await this.userRepository.save(user);

    return createdUser.userId;
  }

  async login(partialUser: Partial<User>): Promise<string> {
    if (!partialUser.email || !partialUser.userName || !partialUser.userId) return '';

    const createdAccessToken = await this.jwtService.signAsync({
      email: partialUser.email,
      userName: partialUser.userName,
    });

    await this.userTokenService.createRefreshToken(partialUser.userId);

    return createdAccessToken;
  }

  async logout(userId: string): Promise<void> {
    await this.userTokenService.removeTokensByUserId(userId, UserTokenType.RefreshToken);
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<void> {
    await this.userRepository.update(userId, updateUserDto);
  }

  async delete(userId: string): Promise<void> {
    await this.userRepository.delete(userId);
  }
}
