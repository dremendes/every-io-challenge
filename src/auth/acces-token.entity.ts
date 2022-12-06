import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AccesToken {
  @Field(() => String, { description: 'Access Token', nullable: true })
  access_token: string;
}
