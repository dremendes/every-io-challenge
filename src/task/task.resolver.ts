import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TaskService } from './task.service';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';

@Resolver('Task')
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Mutation('createTask')
  create(@Args('createTaskInput') createTaskInput: CreateTaskInput) {
    return this.taskService.create(createTaskInput);
  }

  @Query('task')
  findAll() {
    return this.taskService.findAll();
  }

  @Query('task')
  findOne(@Args('id') id: number) {
    return this.taskService.findOne(id);
  }

  @Mutation('updateTask')
  update(@Args('updateTaskInput') updateTaskInput: UpdateTaskInput) {
    return this.taskService.update(updateTaskInput.id, updateTaskInput);
  }

  @Mutation('removeTask')
  remove(@Args('id') id: number) {
    return this.taskService.remove(id);
  }
}
