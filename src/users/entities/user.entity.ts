import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
