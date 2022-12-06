import { InputType, Field } from '@nestjs/graphql';
import { Permissions } from '../../claims-based-authorization/enums/permissions.enum';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'Username' })
  username: string;

  @Field(() => String, { description: 'Password' })
  password: string;

  @Field(() => Permissions, { description: 'User Permissions' })
  permissions: Permissions;
}
