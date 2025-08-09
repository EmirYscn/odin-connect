import { IsString } from 'class-validator';

export class PostEventDto {
  @IsString()
  actorId!: string;
  @IsString()
  postId!: string;
}
