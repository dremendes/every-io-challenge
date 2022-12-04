import { Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(createTaskInput: CreateTaskInput) {
    const result = this.taskRepository.create(createTaskInput);
    return this.taskRepository.save(result);
  }

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async findOne(id: string): Promise<Task> {
    return this.taskRepository.findOneBy({ id });
  }

  async update(id: string, updateTaskInput: Partial<Task>): Promise<Task> {
    await this.taskRepository.update(id, updateTaskInput);
    return this.taskRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.taskRepository.delete(id);
    return result.affected === 1;
  }
}
