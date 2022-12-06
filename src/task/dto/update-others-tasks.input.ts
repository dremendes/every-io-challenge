import { InputType, Field, ID } from '@nestjs/graphql';
import { TaskStatus } from '../entities/task.entity';

@InputType()
export class UpdateOthersTaskInput {
  @Field(() => ID, { description: 'Id' })
  id: string;

  @Field(() => String, { description: 'Title', nullable: true })
  title?: string;

  @Field(() => String, { description: 'Description', nullable: true })
  description?: string;

  @Field(() => TaskStatus, { description: 'Current Status', nullable: true })
  status?: TaskStatus;

  @Field(() => String, { description: 'User to own the Task', nullable: false })
  userId?: string;
}
