// task.module.spec.ts
import { TaskModule } from './task.module';
import { TaskService } from './task.service';
import { TaskResolver } from './task.resolver';
import { Task } from './entities/task.entity';
import { Test } from '@nestjs/testing';

describe('TaskModule', () => {
  let taskModule: TaskModule;

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
  const repositoryMockFactory: () => Task<Repository<any>> = jest.fn(
    () => mockRepository,
  );

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TaskModule,
        { provide: TaskService, useFactory: repositoryMockFactory },
        { provide: TaskResolver, useFactory: repositoryMockFactory },
      ],
    }).compile();

    taskModule = moduleRef.get(TaskModule);
  });

  describe('TaskModule', () => {
    it('should be defined', () => {
      expect(taskModule).toBeDefined();
    });
  });
});
