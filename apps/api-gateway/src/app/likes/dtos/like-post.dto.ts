import { IsNotEmpty, IsString } from 'class-validator';

export class LikePostDto {
  @IsString()
  @IsNotEmpty()
  postId!: string;
}
