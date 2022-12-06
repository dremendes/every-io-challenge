import { InputType, Field, ID } from '@nestjs/graphql';
import { Permissions } from '../../claims-based-authorization/enums/permissions.enum';

@InputType()
export class UpdateUserInput {
  @Field(() => ID, { description: 'Id' })
  id: string;

  @Field(() => String, { description: 'Username' })
  username: string;

  @Field(() => String, { description: 'Password' })
  password: string;

  @Field(() => Permissions, { description: 'User Permissions' })
  permissions: Permissions;
}
