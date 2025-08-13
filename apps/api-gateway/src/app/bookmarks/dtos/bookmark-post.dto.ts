import { IsNotEmpty, IsString } from 'class-validator';

export class BookmarkPostDto {
  @IsString()
  @IsNotEmpty()
  postId!: string;
}
