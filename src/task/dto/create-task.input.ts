import { InputType, Field } from '@nestjs/graphql';
import { TaskStatus } from '../entities/task.entity';

@InputType()
export class CreateTaskInput {
  @Field(() => String, { description: 'Title' })
  title: string;

  @Field(() => String, { description: 'Description' })
  description: string;

  @Field(() => TaskStatus, { description: 'Current Task status' })
  status: TaskStatus;
}
