import { Test, TestingModule } from '@nestjs/testing';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';
import { Task, TaskStatus } from './entities/task.entity';
import { Any, Repository } from 'typeorm';

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
      };

      (service.create as jest.Mock).mockResolvedValue(task);

      expect(await resolver.createTask(createTaskInput)).toEqual(task);
      expect(service.create).toHaveBeenCalledWith(createTaskInput);
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
      };

      (service.update as jest.Mock).mockResolvedValue(task);

      expect(await resolver.updateTask(updateTaskInput)).toBe(task);
    });
  });

  describe('remove', () => {
    it('should remove a task and save it to the repository', async () => {
      (service.remove as jest.Mock).mockResolvedValue(true);

      expect(
        await resolver.removeTask('a675b451-f150-4b8c-8197-bee6df983fa7'),
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

      (service.findOne as jest.Mock).mockResolvedValue(task);

      expect(
        await resolver.findOne('361354a2-c83a-4b4d-bfa2-eb6cabe38311'),
      ).toEqual(task);
    });
  });
});
