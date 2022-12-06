import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { Task, TaskStatus } from './entities/task.entity';
import { Any, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../users/user.service';
import { User } from '../users/entities/user.entity';
import { Permissions } from '../claims-based-authorization/enums/permissions.enum';

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findAll: jest.fn(),
  findOneBy: jest.fn(),
  findBy: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

// @ts-ignore
export const repositoryMockFactory: () => Task<Repository<Task>> = jest.fn(
  () => mockRepository,
);

// @ts-ignore
export const repositoryMockFactory: () => User<Repository<User>> = jest.fn(
  () => mockRepository,
);

describe('TaskService', () => {
  let service: TaskService;
  let taskRepository: Repository<Task>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useFactory: repositoryMockFactory,
        },
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepository = module.get(getRepositoryToken(Task));
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task and save it to the repository', async () => {
      const createTaskInput = {
        id: 'a675b451-f150-4b8c-8197-bee6df983fa7',
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.Todo,
      };

      const task = {
        id: 'a675b451-f150-4b8c-8197-bee6df983fa7',
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.Todo,
        user: {
          id: '8115baf5-aed1-4f0e-8aa2-5b08a700211b',
          username: 'test-user',
          permissions: Permissions.USER,
        },
      };

      const userRepoFindOneBySpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockImplementation(() => task.user as any);

      const taskRepoCreateSpy = jest
        .spyOn(taskRepository, 'create')
        .mockImplementation(() => task as any);

      const taskRepoSaveSpy = jest
        .spyOn(taskRepository, 'save')
        .mockImplementation(() => task as any);

      expect(
        await service.create(
          createTaskInput,
          '8115baf5-aed1-4f0e-8aa2-5b08a700211b',
        ),
      ).toEqual({ ...task, user: task.user });
      expect(taskRepoCreateSpy).toHaveBeenCalledWith(task);
      expect(taskRepoSaveSpy).toHaveBeenCalledWith(task);
      expect(userRepoFindOneBySpy).toHaveBeenCalledWith({ id: task.user.id });
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

      const user = {
        id: '8115baf5-aed1-4f0e-8aa2-5b08a700211b',
        username: 'test-user',
        permissions: Permissions.USER,
      } as any;

      const taskRepoFindOneBySpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockImplementation(() => user as any);

      const taskRepoUpdateSpy = jest
        .spyOn(taskRepository, 'update')
        .mockImplementation(() => true as any);

      expect(
        await service.update(updateTaskInput.id, updateTaskInput, user),
      ).toBe(user);

      expect(taskRepoUpdateSpy).toHaveBeenCalledWith(updateTaskInput.id, {
        ...updateTaskInput,
        user,
      });
      expect(taskRepoFindOneBySpy).toHaveBeenCalledWith({
        id: updateTaskInput.id,
      });
    });
  });

  describe('remove', () => {
    it('should remove a task and save it to the repository', async () => {
      const tasksArray = [
        {
          id: 'a675b451-f150-4b8c-8197-bee6df983fa7',
          title: 'Test Task',
          description: 'Test Description',
          status: TaskStatus.Todo,
          user: {
            id: '8115baf5-aed1-4f0e-8aa2-5b08a700211b',
            username: 'test-user',
            permissions: Permissions.USER,
          },
        },
      ];

      const userRepoDeleteSpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(tasksArray[0].user as any);

      const taskRepoFindBySpy = jest
        .spyOn(taskRepository, 'findBy')
        .mockResolvedValue(tasksArray as any);
      const taskId = 'a675b451-f150-4b8c-8197-bee6df983fa7';

      const taskRepoDeleteSpy = jest
        .spyOn(taskRepository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      expect(
        await service.remove(taskId, '8115baf5-aed1-4f0e-8aa2-5b08a700211b'),
      ).toBe(true);

      expect(userRepoDeleteSpy).toHaveBeenCalledWith({
        id: tasksArray[0].user.id,
      });
      expect(taskRepoFindBySpy).toHaveBeenCalledWith({
        id: taskId,
        user: tasksArray[0].user,
      });
      expect(taskRepoDeleteSpy).toHaveBeenCalledWith(taskId);
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
        .spyOn(taskRepository, 'find')
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

      await service.create(task, '8115baf5-aed1-4f0e-8aa2-5b08a700211b');

      const repoFindOneBySpy = jest
        .spyOn(taskRepository, 'findOneBy')
        .mockImplementation(() => task as any);

      expect(await service.findOne(task.id)).toBe(task);
      expect(repoFindOneBySpy).toHaveBeenCalledWith({ id: task.id });
    });
  });
});
