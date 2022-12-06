import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Any, Repository } from 'typeorm';

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

// @ts-ignore
export const repositoryMockFactory: () => User<Repository<any>> = jest.fn(
  () => mockRepository,
);

describe('UserResolver', () => {
  let resolver: UserResolver;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        { provide: UserService, useFactory: repositoryMockFactory },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createUser', () => {
    it('should call create on the User service and return the result', async () => {
      const createUserInput = {
        username: 'user-test',
        password: 'test-password',
      };
      const user = {
        id: '1',
        username: 'user-test',
        password: 'test-password',
      };

      (service.create as jest.Mock).mockResolvedValue(user);

      expect(await resolver.createUser(createUserInput)).toEqual(user);
      expect(service.create).toHaveBeenCalledWith(createUserInput);
    });
  });

  describe('update', () => {
    it('should update a User and save it to the repository', async () => {
      const updateUserInput = {
        id: 'a675b451-f150-4b8c-8197-bee6df983fa7',
        username: 'user-test',
        password: 'test-password - updated',
      };

      const user = {
        id: Any<string>,
        username: 'user-test',
        password: 'test-password - updated',
      };

      (service.update as jest.Mock).mockResolvedValue(user);

      expect(await resolver.updateUser(updateUserInput)).toBe(user);
    });
  });

  describe('remove', () => {
    it('should remove a User and save it to the repository', async () => {
      (service.remove as jest.Mock).mockResolvedValue(true);

      expect(
        await resolver.removeUser('a675b451-f150-4b8c-8197-bee6df983fa7'),
      ).toBe(true);
    });
  });

  describe('findAll', () => {
    it('should call findAll on the User service and return the result', async () => {
      const users = [
        {
          id: '1',
          username: 'user-test 1',
          password: 'test-password 1',
        },
        {
          id: '2',
          username: 'user-test 2',
          password: 'test-password 2',
        },
        {
          id: '3',
          username: 'user-test 3',
          password: 'test-password 3',
        },
      ];

      (service.findAll as jest.Mock).mockResolvedValue(users);

      expect(await resolver.findAll()).toEqual(users);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should call findOne on the User service and return the result', async () => {
      const user = {
        id: '361354a2-c83a-4b4d-bfa2-eb6cabe38311',
        username: 'user-test',
        password: 'test-password',
      };

      (service.findById as jest.Mock).mockResolvedValue(user);

      expect(
        await resolver.findOne('361354a2-c83a-4b4d-bfa2-eb6cabe38311'),
      ).toEqual(user);
    });
  });
});
