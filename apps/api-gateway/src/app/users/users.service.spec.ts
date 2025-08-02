// import { Test } from '@nestjs/testing';
// import { UsersService } from './users.service';
// import { PrismaService } from '@odin-connect-monorepo/prisma';

// describe('UsersService', () => {
//   let service: UsersService;

//   const mockPrismaService = {
//     user: {
//       findUnique: jest
//         .fn()
//         .mockImplementation(
//           (
//             params: Record<string, unknown>
//           ): Promise<Record<string, unknown> | null> =>
//             Promise.resolve({ id: Date.now().toString(), ...params })
//         ),
//       create: jest.fn().mockImplementation(
//         (dto: Record<string, unknown>): Promise<Record<string, unknown>> =>
//           Promise.resolve({
//             id: Date.now().toString(),
//             ...dto,
//           })
//       ),
//       update: jest
//         .fn()
//         .mockImplementation(
//           (dto: Record<string, unknown>): Record<string, unknown> => dto
//         ),
//     },
//   };

//   beforeEach(async () => {
//     const module = await Test.createTestingModule({
//       providers: [
//         UsersService,
//         {
//           provide: PrismaService,
//           useValue: mockPrismaService,
//         },
//       ],
//     }).compile();

//     service = module.get<UsersService>(UsersService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   it('should create a user', async () => {
//     const dto = {
//       email: 'testuser@test.com',
//       username: 'testuser',
//       password: 'passtest',
//     };

//     const expectedCreateArg = {
//       data: {
//         email: dto.email,
//         username: dto.username,
//         password: expect.any(String), // hashed password
//         userSettings: {
//           create: {
//             notifications: true,
//           },
//         },
//       },
//     };

//     const expectedResult = {
//       id: expect.any(String),
//       email: dto.email,
//       username: dto.username,
//       password: expect.any(String),
//     };

//     mockPrismaService.user.findUnique
//       .mockResolvedValueOnce(null)
//       .mockResolvedValueOnce(null);

//     mockPrismaService.user.create.mockResolvedValue(expectedResult);

//     const result = await service.createUser(dto);
//     expect(result).toEqual(expectedResult);
//     expect(mockPrismaService.user.create).toHaveBeenCalledWith(
//       expectedCreateArg
//     );
//   });
// });
