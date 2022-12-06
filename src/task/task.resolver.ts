import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { TaskService } from './task.service';
import { Task } from './entities/task.entity';
import { CreateTaskAdminInput } from './dto/create-task-admin.input';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { UpdateOthersTaskInput } from './dto/update-others-tasks.input';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Permissions } from '../claims-based-authorization/enums/permissions.enum';
import { RequirePermissions } from '../claims-based-authorization/require-permissions.decorator';
import { RequirePermissionsGuard } from '../claims-based-authorization/require-permisions.guard';


@Resolver(() => Task)
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(GqlAuthGuard, RequirePermissionsGuard)
  @RequirePermissions(Permissions.USER, Permissions.ADMIN)
  @Mutation(() => Task)
  createTask(
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
    @Context('req') req: any,
  ) {
    return this.taskService.create(createTaskInput, req.user.userData.userId);
  }

  @UseGuards(GqlAuthGuard, RequirePermissionsGuard)
  @RequirePermissions(Permissions.ADMIN)
  @Mutation(() => Task)
  createTaskForUser(@Args('createTaskInput') createTaskInput: CreateTaskInput) {
    return this.taskService.create(createTaskInput, null);
  }

  @UseGuards(GqlAuthGuard, RequirePermissionsGuard)
  @RequirePermissions(Permissions.USER, Permissions.ADMIN)
  @Query(() => [Task], { name: 'myTasks', nullable: true })
  myTasks(@Context('req') req: any) {
    return this.taskService.findByUserId(req.user.userData.userId);
  }

  @UseGuards(GqlAuthGuard, RequirePermissionsGuard)
  @RequirePermissions(Permissions.ADMIN)
  @Query(() => [Task], { name: 'tasks', nullable: true })
  findAll() {
    return this.taskService.findAll();
  }

  @UseGuards(GqlAuthGuard, RequirePermissionsGuard)
  @RequirePermissions(Permissions.USER, Permissions.ADMIN)
  @Query(() => Task, { name: 'task', nullable: true })
  findOne(
    @Args('id', { type: () => String }) id: string,
    @Context('req') req: any,
  ) {
    return this.taskService.findOne(id, req.user.userData.userId);
  }

  @UseGuards(GqlAuthGuard, RequirePermissionsGuard)
  @RequirePermissions(Permissions.ADMIN)
  @Query(() => Task, { name: 'task', nullable: true })
  findOneFromAny(@Args('id', { type: () => String }) id: string) {
    return this.taskService.findOne(id, null);
  }

  @UseGuards(GqlAuthGuard, RequirePermissionsGuard)
  @RequirePermissions(Permissions.USER, Permissions.ADMIN)
  @Mutation(() => Task, { nullable: true })
  updateTask(
    @Args('updateTaskInput') updateTaskInput: UpdateTaskInput,
    @Context('req') req: any,
  ) {
    return this.taskService.update(
      updateTaskInput.id,
      updateTaskInput,
      req.user.userData.userId,
    );
  }

  @UseGuards(GqlAuthGuard, RequirePermissionsGuard)
  @RequirePermissions(Permissions.ADMIN)
  @Mutation(() => Task, { nullable: true })
  updateAnyTask(
    @Args('updateTaskInput') updateTaskInput: UpdateOthersTaskInput,
  ) {
    return this.taskService.update(updateTaskInput.id, updateTaskInput, null);
  }

  @UseGuards(GqlAuthGuard, RequirePermissionsGuard)
  @RequirePermissions(Permissions.USER, Permissions.ADMIN)
  @Mutation(() => Boolean, { nullable: true })
  removeTask(
    @Args('id', { type: () => String }) id: string,
    @Context('req') req: any,
  ) {
    return this.taskService.remove(id, req.user.userData.userId);
  }

  @UseGuards(GqlAuthGuard, RequirePermissionsGuard)
  @RequirePermissions(Permissions.ADMIN)
  @Mutation(() => Boolean, { nullable: true })
  removeAnyTask(@Args('id', { type: () => String }) id: string) {
    return this.taskService.remove(id, null);
  }
}
