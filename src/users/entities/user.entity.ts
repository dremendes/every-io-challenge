import { ObjectType, Field } from '@nestjs/graphql';
import { Permissions } from '../../claims-based-authorization/enums/permissions.enum';
import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from '../../task/entities/task.entity';

@Entity()
@ObjectType()
export class User {
  @Field(() => String, { description: 'UUID', nullable: false })
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PRIMARY_KEY_USER',
  })
  id: string;

  @Field(() => String, { description: 'Username' })
  @Column()
  username: string;

  @Field(() => String, { description: 'Password', nullable: true })
  @Column()
  password?: string;

  @Field(() => [Permissions], { description: 'User Permissions' })
  @Column({
    type: 'enum',
    enum: Permissions,
    default: Permissions.USER,
  })
  permissions: Permissions;

  @Field(() => Task, { description: 'List of User Tasks', nullable: true })
  @OneToMany(() => Task, (task: Task) => task.user, {
    onDelete: 'CASCADE',
    cascade: true,
    orphanedRowAction: 'delete',
    nullable: true,
  })
  @JoinTable()
  tasks: Task[];
}
