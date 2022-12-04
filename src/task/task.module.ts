import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskResolver } from './task.resolver';
import { TaskRepository } from './repositories/task.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TaskRepository])],
  providers: [TaskService, TaskResolver],
})
export class TaskModule {}
