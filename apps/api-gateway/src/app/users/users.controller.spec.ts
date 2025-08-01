import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '@prisma/client';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    createUser: jest.fn(
      (dto: Record<string, unknown>): Record<string, unknown> => {
        return { id: Date.now(), ...dto };
      },
    ),
    updateUser: jest.fn().mockImplementation(
      (id: string, dto: Record<string, unknown>): Record<string, unknown> => ({
        id,
        ...dto,
      }),
    ),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('UsersController should be defined', () => {
    expect(controller).toBeDefined();
  });

  // it('should create a user', async () => {
  //   const dto = {
  //     email: 'testuser@test.com',
  //     username: 'testuser',
  //     password: 'passtest',
  //   };

  //   const expected = { id: Date, ...dto };

  //   (mockUsersService.createUser as jest.Mock).mockResolvedValue(expected);

  //   const result = await controller.createUser(dto);
  //   expect(result).toEqual(expected);
  //   expect(mockUsersService.createUser).toHaveBeenCalledWith(dto);
  // });

  it('should update a user', async () => {
    const user: Partial<User> = {
      id: '1',
    };
    const dto = {
      username: 'testusernew',
    };

    const expected = { id: '1', ...dto };

    const result = await controller.updateUser(user as User, dto);
    expect(result).toEqual(expected);
    expect(mockUsersService.updateUser).toHaveBeenCalled();
  });
});
