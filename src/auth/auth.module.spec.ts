// auth.module.spec.ts
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import { TaskModule } from '../task/task.module';
import { TaskService } from '../task/task.service';

describe('AuthModule', () => {
  let authModule: AuthModule;

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
  const repositoryMockFactory: () => Auth<Repository<any>> = jest.fn(
    () => mockRepository,
  );

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthModule,
        { provide: AuthService, useFactory: repositoryMockFactory },
        TaskModule,
        { provide: TaskService, useFactory: repositoryMockFactory },
      ],
    }).compile();

    authModule = moduleRef.get(AuthModule);
  });

  describe('AuthModule', () => {
    it('should be defined', () => {
      expect(authModule).toBeDefined();
    });
  });
});
