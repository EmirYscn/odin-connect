import { Test } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { User } from '@prisma/client';

describe('PostsController', () => {
  let controller: PostsController;

  const mockPostsService = {
    createPost: jest.fn(
      (dto: Record<string, unknown>): Record<string, unknown> => {
        return { id: new Date(), ...dto };
      },
    ),
    getFeedPosts: jest.fn(),
    getFollowingPosts: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [PostsService],
    })
      .overrideProvider(PostsService)
      .useValue(mockPostsService)
      .compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('PostsController should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a post', async () => {
    const user: Partial<User> = {
      id: '1',
      email: 'testuser@test.com',
      username: 'testuser',
    };
    const dto = {
      content: 'Hello',
    };

    const expected = { id: Date, content: dto.content };

    (mockPostsService.createPost as jest.Mock).mockResolvedValue(expected);

    const result = await controller.createPost(dto, user as User);
    expect(result).toEqual(expected);
    expect(mockPostsService.createPost).toHaveBeenCalledWith(user.id, dto);
  });
});
