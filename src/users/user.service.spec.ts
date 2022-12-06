import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Any, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Permissions } from '../claims-based-authorization/enums/permissions.enum';

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
export const repositoryMockFactory: () => User<Repository<any>> = jest.fn(
  () => mockRepository,
);

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new User and save it to the repository', async () => {
      const createUserInput = {
        username: 'test-user',
        password: 'password',
        permissions: Permissions.USER,
      };
      const User = {
        id: Any<string>,
        username: 'test-user',
        password: 'password',
      };

      const repoCreateSpy = jest
        .spyOn(repository, 'create')
        .mockImplementation(() => User as any);
      const repoSaveSpy = jest
        .spyOn(repository, 'save')
        .mockImplementation(() => User as any);

      expect(await service.create(createUserInput)).toBe(User);
      expect(repoCreateSpy).toHaveBeenCalledWith(createUserInput);
      expect(repoSaveSpy).toHaveBeenCalledWith(User);
    });
  });

  describe('update', () => {
    it('should update a User and save it to the repository', async () => {
      const updateUserInput = {
        id: 'a675b451-f150-4b8c-8197-bee6df983fa7',
        username: 'test-user',
        password: 'password-updated',
      };

      const repoUpdateSpy = jest
        .spyOn(repository, 'update')
        .mockImplementation(() => true as any);
      const repoFindOneBySpy = jest
        .spyOn(repository, 'findOneBy')
        .mockImplementation(() => updateUserInput as any);

      expect(await service.update(updateUserInput.id, updateUserInput)).toBe(
        updateUserInput,
      );
      expect(repoUpdateSpy).toHaveBeenCalledWith(
        updateUserInput.id,
        updateUserInput,
      );
      expect(repoFindOneBySpy).toHaveBeenCalledWith({ id: updateUserInput.id });
    });
  });

  describe('remove', () => {
    it('should remove a User and save it to the repository', async () => {
      const repoDeleteSpy = jest
        .spyOn(repository, 'delete')
        .mockImplementation(() => ({ affected: 1 } as any));
      const UserId = 'a675b451-f150-4b8c-8197-bee6df983fa7';

      expect(await service.remove(UserId)).toBe(true);
      expect(repoDeleteSpy).toHaveBeenCalledWith(UserId);
    });
  });

  describe('findAll', () => {
    it('should return all Users from the repository', async () => {
      const users = [
        {
          id: Any<string>,
          username: 'test-user 1',
          password: 'password 1',
        },
        {
          id: Any<string>,
          username: 'test-user 2',
          password: 'password 2',
        },
        {
          id: Any<string>,
          username: 'test-user 3',
          password: 'password 3',
        },
      ];

      const repoFindSpy = jest
        .spyOn(repository, 'find')
        .mockImplementation(() => users as any);

      expect(await service.findAll()).toBe(users);
      expect(repoFindSpy).toHaveBeenCalledWith();
    });
  });

  describe('findByUsername', () => {
    it('should return a single User from the repository by its id', async () => {
      const user = {
        id: '361354a2-c83a-4b4d-bfa2-eb6cabe38311',
        username: 'test-user',
        password: 'password',
        permissions: Permissions.USER,
      };

      await service.create(user);

      const findByUsernameSpy = jest
        .spyOn(repository, 'findOneBy')
        .mockImplementation(() => user as any);

      expect(await service.findByUsername(user.username)).toBe(user);
      expect(findByUsernameSpy).toHaveBeenCalledWith({
        username: user.username,
      });
    });
  });

  describe('findById', () => {
    it('should return a single User from the repository by its id', async () => {
      const user = {
        id: '361354a2-c83a-4b4d-bfa2-eb6cabe38311',
        username: 'test-user',
        password: 'password',
        permissions: Permissions.USER,
      };

      await service.create(user);

      const repoFindByIdBySpy = jest
        .spyOn(repository, 'findOneBy')
        .mockImplementation(() => user as any);

      expect(await service.findById(user.id)).toBe(user);
      expect(repoFindByIdBySpy).toHaveBeenCalledWith({
        id: user.id,
      });
    });
  });
});
