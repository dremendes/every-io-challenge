import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { Task, TaskStatus } from './entities/task.entity';
import { Any, Repository } from 'typeorm';
import { TaskRepository } from './repositories/task.repository';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findAll: jest.fn(),
  findOneBy: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

// @ts-ignore
export const repositoryMockFactory: () => Task<Repository<any>> = jest.fn(
  () => mockRepository,
);

describe('TaskService', () => {
  let service: TaskService;
  let repository: TaskRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    repository = module.get(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task and save it to the repository', async () => {
      const createTaskInput = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.Todo,
      };
      const task = {
        id: Any<string>,
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.Todo,
      };

      const repoCreateSpy = jest
        .spyOn(repository, 'create')
        .mockImplementation(() => task as any);
      const repoSaveSpy = jest
        .spyOn(repository, 'save')
        .mockImplementation(() => task as any);

      expect(await service.create(createTaskInput)).toBe(task);
      expect(repoCreateSpy).toHaveBeenCalledWith(createTaskInput);
      expect(repoSaveSpy).toHaveBeenCalledWith(task);
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

      const repoUpdateSpy = jest
        .spyOn(repository, 'update')
        .mockImplementation(() => true as any);
      const repoFindOneBySpy = jest
        .spyOn(repository, 'findOneBy')
        .mockImplementation(() => updateTaskInput as any);

      expect(await service.update(updateTaskInput.id, updateTaskInput)).toBe(
        updateTaskInput,
      );
      expect(repoUpdateSpy).toHaveBeenCalledWith(
        updateTaskInput.id,
        updateTaskInput,
      );
      expect(repoFindOneBySpy).toHaveBeenCalledWith({ id: updateTaskInput.id });
    });
  });

  describe('remove', () => {
    it('should remove a task and save it to the repository', async () => {
      const repoDeleteSpy = jest
        .spyOn(repository, 'delete')
        .mockImplementation(() => ({ affected: 1 } as any));
      const taskId = 'a675b451-f150-4b8c-8197-bee6df983fa7';

      expect(await service.remove(taskId)).toBe(true);
      expect(repoDeleteSpy).toHaveBeenCalledWith(taskId);
    });
  });

  describe('findAll', () => {
    it('should return all tasks from the repository', async () => {
      const tasks = [
        {
          id: Any<string>,
          title: 'Test Task 1',
          description: 'Test Description 1',
          status: TaskStatus.Todo,
        },
        {
          id: Any<string>,
          title: 'Test Task 2',
          description: 'Test Description 2',
          status: 'In Progress',
        },
        {
          id: Any<string>,
          title: 'Test Task 3',
          description: 'Test Description 3',
          status: 'Done',
        },
      ];

      const repoFindSpy = jest
        .spyOn(repository, 'find')
        .mockImplementation(() => tasks as any);

      expect(await service.findAll()).toBe(tasks);
      expect(repoFindSpy).toHaveBeenCalledWith();
    });
  });

  describe('findOne', () => {
    it('should return a single task from the repository by its id', async () => {
      const task = {
        id: '361354a2-c83a-4b4d-bfa2-eb6cabe38311',
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.Todo,
      };

      await service.create(task);

      const repoFindOneBySpy = jest
        .spyOn(repository, 'findOneBy')
        .mockImplementation(() => task as any);

      expect(await service.findOne(task.id)).toBe(task);
      expect(repoFindOneBySpy).toHaveBeenCalledWith({ id: task.id });
    });
  });
});
