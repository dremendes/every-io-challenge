// users.module.spec.ts
import { UserModule } from './user.module';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { Test } from '@nestjs/testing';

describe('UserModule', () => {
  let userModule: UserModule;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  // @ts-ignore
  const repositoryMockFactory: () => User<Repository<any>> = jest.fn(
    () => mockRepository,
  );

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserModule,
        { provide: UserService, useFactory: repositoryMockFactory },
        { provide: UserResolver, useFactory: repositoryMockFactory },
      ],
    }).compile();

    userModule = moduleRef.get(UserModule);
  });

  describe('UsersModule', () => {
    it('should be defined', () => {
      expect(userModule).toBeDefined();
    });
  });
});
