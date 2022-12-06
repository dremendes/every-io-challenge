import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskResolver } from './task.resolver';
import { User } from '../users/entities/user.entity';
import { UserService } from '../users/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), TypeOrmModule.forFeature([User])],
  providers: [TaskService, TaskResolver, UserService],
  exports: [TaskService],
})
export class TaskModule {}
