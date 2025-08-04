import { IsString } from 'class-validator';

export class PostLikedDto {
  @IsString()
  actorId!: string;
  @IsString()
  postId!: string;
}
