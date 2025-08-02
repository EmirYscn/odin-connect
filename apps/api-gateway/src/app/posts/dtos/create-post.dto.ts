import { IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsOptional()
  @IsString()
  content!: string;
  @IsOptional()
  @IsString()
  parentId?: string; // If provided, this post is a reply to another post
}
