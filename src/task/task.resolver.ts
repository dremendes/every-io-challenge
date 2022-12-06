import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TaskService } from './task.service';
import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Task)
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Task)
  createTask(@Args('createTaskInput') createTaskInput: CreateTaskInput) {
    return this.taskService.create(createTaskInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Task], { name: 'tasks', nullable: true })
  findAll() {
    return this.taskService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Task, { name: 'task', nullable: true })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.taskService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Task, { nullable: true })
  updateTask(@Args('updateTaskInput') updateTaskInput: UpdateTaskInput) {
    return this.taskService.update(updateTaskInput.id, updateTaskInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean, { nullable: true })
  removeTask(@Args('id', { type: () => String }) id: string) {
    return this.taskService.remove(id);
  }
}
