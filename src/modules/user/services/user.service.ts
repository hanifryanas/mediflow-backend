import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '../dtos';
import { User } from '../entities';

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

  async findBy(partialUser: Partial<User>): Promise<User[]> {
    return await this.userRepository.findBy(partialUser);
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
