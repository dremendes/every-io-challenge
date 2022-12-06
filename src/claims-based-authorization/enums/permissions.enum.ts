import { registerEnumType } from '@nestjs/graphql';

export enum Permissions {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

registerEnumType(Permissions, {
  name: 'Permission',
  description: 'Permissions an User can have',
  valuesMap: {
    ADMIN: {
      description: 'User that can CRUD ALL tasks',
    },
    USER: {
      description: 'User that can only CRUD its own tasks',
    },
  },
});
