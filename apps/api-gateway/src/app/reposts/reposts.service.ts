// import {
//   Injectable,
//   NotFoundException,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { PrismaService } from '@odin-connect-monorepo/prisma';
// import { NotificationClientService } from '../notification-client/notification-client.service';
// import { ProfileService } from '../profile/profile.service';

// @Injectable()
// export class RepostsService {
//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly notificationPub: NotificationClientService,
//     private readonly profileService: ProfileService
//   ) {}

//   async createRepost(userId: string, postId: string) {
//     const hasReposted = await this.prisma.repost.findUnique({
//       where: {
//         userId_postId: {
//           userId,
//           postId,
//         },
//       },
//     });

//     if (hasReposted) {
//       return this.prisma.repost.delete({
//         where: {
//           userId_postId: {
//             userId,
//             postId,
//           },
//         },
//       });
//     }
//     const user = await this.prisma.user.findUnique({
//       where: { id: userId },
//     });
//     if (!user) {
//       throw new NotFoundException(`User with ID ${userId} not found`);
//     }

//     const post = await this.prisma.post.findUnique({ where: { id: postId } });
//     if (!post) {
//       throw new NotFoundException('Post not found');
//     }

//     const repost = await this.prisma.repost.create({
//       data: {
//         userId,
//         postId,
//       },
//     });

//     // Try to create a notification for the repost event
//     await this.notificationPub.tryCreatePostRelatedNotification(
//       userId,
//       postId,
//       'post:reposted',
//       'REPOST'
//     );

//     return repost;
//   }

//   async getProfileReposts(profileId: string) {
//     // Validate user exists
//     const profile = await this.profileService.getProfileById(profileId);
//     if (!profile) {
//       throw new UnauthorizedException('User not found');
//     }
//     const userId = profile.user.id;

//     return this.prisma.repost.findMany({
//       where: { userId },
//       include: {
//         user: {
//           select: {
//             id: true,
//             username: true,
//             displayName: true,
//             avatar: true,
//             profile: true,
//           },
//         },
//         post: {
//           include: {
//             user: {
//               select: {
//                 id: true,
//                 username: true,
//                 displayName: true,
//                 avatar: true,
//                 profile: true,
//               },
//             },
//             likes: {
//               select: {
//                 userId: true,
//               },
//             },
//             reposts: {
//               select: {
//                 userId: true,
//               },
//             },
//             medias: {
//               select: {
//                 id: true,
//                 url: true,
//                 type: true,
//               },
//             },
//             _count: {
//               select: {
//                 replies: true,
//                 likes: true,
//                 bookmarks: true,
//                 reposts: true,
//               },
//             },
//           },
//         },
//       },
//       orderBy: { createdAt: 'desc' },
//     });
//   }

//   async getRepostById(repostId: string) {
//     return this.prisma.repost.findUnique({
//       where: { id: repostId },
//       include: {
//         post: true,
//         user: true,
//       },
//     });
//   }
// }
