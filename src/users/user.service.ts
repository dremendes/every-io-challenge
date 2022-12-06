import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput) {
    const result = this.userRepository.create(createUserInput);
    return this.userRepository.save(result);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username });
  }

  async findById(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: string, updateUsersInput: Partial<User>): Promise<User> {
    await this.userRepository.update(id, updateUsersInput);
    return this.userRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected === 1;
  }
}
