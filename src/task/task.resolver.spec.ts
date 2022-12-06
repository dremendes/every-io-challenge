import { Test, TestingModule } from '@nestjs/testing';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';
import { Task, TaskStatus } from './entities/task.entity';
import { Any, Repository } from 'typeorm';
import { UserService } from '../users/user.service';
import { Permissions } from '../claims-based-authorization/enums/permissions.enum';

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
export const repositoryMockFactory: () => Task<Repository<any>> = jest.fn(
  () => mockRepository,
);

describe('TaskResolver', () => {
  let resolver: TaskResolver;
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskResolver,
        { provide: TaskService, useFactory: repositoryMockFactory },
        UserService,
        { provide: UserService, useValue: { Symbol: jest.fn() } },
      ],
    }).compile();

    resolver = module.get<TaskResolver>(TaskResolver);
    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createTask', () => {
    it('should call create on the task service and return the result', async () => {
      const createTaskInput = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.Todo,
      };
      const task = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.Todo,
        user: {
          id: '8115baf5-aed1-4f0e-8aa2-5b08a700211b',
          name: 'test-user',
          permissions: Permissions.USER,
        },
      };

      const req = {
        user: { userData: { userId: '8115baf5-aed1-4f0e-8aa2-5b08a700211b' } },
      };

      (service.create as jest.Mock).mockResolvedValue(task);

      expect(await resolver.createTask(createTaskInput, req)).toEqual(task);
      expect(service.create).toHaveBeenCalledWith(
        createTaskInput,
        '8115baf5-aed1-4f0e-8aa2-5b08a700211b',
      );
    });
  });

  describe('update', () => {
    it('should update a task and save it to the repository', async () => {
      const updateTaskInput = {
        id: 'a675b451-f150-4b8c-8197-bee6df983fa7',
        title: 'Test Task',
        description: 'Test Description - updated',
        status: TaskStatus.Todo,
      };

      const task = {
        id: Any<string>,
        title: 'Test Task',
        description: 'Test Description - updated',
        status: TaskStatus.Todo,
        user: {
          id: '8115baf5-aed1-4f0e-8aa2-5b08a700211b',
          name: 'test-user',
          permissions: ['can_view_own_tasks'],
        },
      };

      const req = {
        user: { userData: { userId: '8115baf5-aed1-4f0e-8aa2-5b08a700211b' } },
      };

      (service.update as jest.Mock).mockResolvedValue(task);

      expect(await resolver.updateTask(updateTaskInput, req)).toBe(task);
    });
  });

  describe('remove', () => {
    it('should remove a task and save it to the repository', async () => {
      (service.remove as jest.Mock).mockResolvedValue(true);

      const req = {
        user: { userData: { userId: '8115baf5-aed1-4f0e-8aa2-5b08a700211b' } },
      };

      expect(
        await resolver.removeTask('a675b451-f150-4b8c-8197-bee6df983fa7', req),
      ).toBe(true);
    });
  });

  describe('findAll', () => {
    it('should call findAll on the task service and return the result', async () => {
      const tasks = [
        {
          id: '1',
          title: 'Test Task 1',
          description: 'Test Description 1',
          status: TaskStatus.Todo,
        },
        {
          id: '2',
          title: 'Test Task 2',
          description: 'Test Description 2',
          status: 'In Progress',
        },
        {
          id: '3',
          title: 'Test Task 3',
          description: 'Test Description 3',
          status: 'Done',
        },
      ];

      (service.findAll as jest.Mock).mockResolvedValue(tasks);

      expect(await resolver.findAll()).toEqual(tasks);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call findOne on the task service and return the result', async () => {
      const task = {
        id: '361354a2-c83a-4b4d-bfa2-eb6cabe38311',
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.Todo,
      };

      const req = {
        user: { userData: { userId: '8115baf5-aed1-4f0e-8aa2-5b08a700211b' } },
      };

      (service.findOne as jest.Mock).mockResolvedValue(task);

      expect(
        await resolver.findOne('361354a2-c83a-4b4d-bfa2-eb6cabe38311', req),
      ).toEqual(task);
    });
  });
});
