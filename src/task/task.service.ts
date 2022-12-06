import { Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createTaskInput: CreateTaskInput, userId: string) {
    if (userId === null) {
      const result = await this.taskRepository.create(createTaskInput);
      return this.taskRepository.save(result);
    }

    const user: User = await this.userRepository.findOneBy({ id: userId });
    const result = this.taskRepository.create({ ...createTaskInput, user });
    return this.taskRepository.save(result);
  }

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async findByUserId(userId: string): Promise<Task[]> {
    const user: User = await this.userRepository.findOneBy({ id: userId });
    const result = await this.taskRepository.findBy({ user });
    const taskWithUser = [];
    result.forEach((task) =>
      taskWithUser.push({
        title: task.title,
        status: task.status,
        id: task.id,
        description: task.description,
        user,
      }),
    );
    return taskWithUser;
  }

  async findOne(id: string, userId: string = null): Promise<Task> {
    if (userId === null) return this.taskRepository.findOneBy({ id });

    const user: User = await this.userRepository.findOneBy({ id: userId });
    const result = await this.taskRepository.findOneBy({ id, user });

    return {
      title: result.title,
      status: result.status,
      id: result.id,
      description: result.description,
      user,
    };
  }

  async update(
    id: string,
    updateTaskInput: Partial<Task>,
    userId: string,
  ): Promise<Task> {
    if (userId === null) {
      await this.taskRepository.update(id, updateTaskInput);
    } else {
      const user: User = await this.userRepository.findOneBy({ id: userId });
      await this.taskRepository.update(id, { ...updateTaskInput, user });
    }
    return this.taskRepository.findOneBy({ id });
  }

  async remove(id: string, userId: string): Promise<boolean> {
    let result;

    if (userId === null) {
      result = await this.taskRepository.delete(id);
    } else {
      const user: User = await this.userRepository.findOneBy({ id: userId });
      const tasks: Task[] = await this.taskRepository.findBy({
        id,
        user: user,
      });
      if (tasks.length === 1) {
        result = await this.taskRepository.delete(id);
      }
    }

    return result?.affected === 1;
  }
}
