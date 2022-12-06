import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum TaskStatus {
  Todo = 'To Do',
  Inprogress = 'In Progress',
  Done = 'Done',
  Archived = 'Archived',
}

registerEnumType(TaskStatus, {
  name: 'TaskStatus',
  description: 'Supported Task statuses',
  valuesMap: {
    Todo: {
      description: 'To Do',
    },
    Inprogress: {
      description: 'In Progress',
    },
    Done: {
      description: 'Done',
    },
    Archived: {
      description: 'Archived',
    },
  },
});

@Entity()
@ObjectType()
export class Task {
  @Field(() => String, { description: 'UUID', nullable: false })
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PRIMARY_KEY_TASK',
  })
  id: string;

  @Field(() => String, { description: 'Title' })
  @Column()
  title: string;

  @Field(() => String, { description: 'Description', nullable: true })
  @Column()
  description?: string;

  @Field(() => TaskStatus, { description: 'Current Task status' })
  @Column({ type: 'enum', enum: TaskStatus })
  status: TaskStatus;

  @Field(() => User, {
    description: 'User that owns this Task',
    nullable: true,
  })
  @ManyToOne(() => User, (user: User) => user.tasks)
  @JoinColumn()
  user?: User;
}
