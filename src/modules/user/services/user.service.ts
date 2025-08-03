import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, FilterUserDto, UpdateUserDto } from '../dtos';
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

  async findOneBy(userField: keyof User, userValue: User[keyof User]): Promise<User | null> {
    return await this.userRepository.findOneBy({ [userField]: userValue });
  }

  async findBy(filterUserDto: FilterUserDto): Promise<User[]> {
    const options = Object.entries(filterUserDto).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as any);

    return await this.userRepository.find({ where: options });
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
