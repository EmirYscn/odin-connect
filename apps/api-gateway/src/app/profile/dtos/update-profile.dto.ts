import { IsOptional, IsString } from 'class-validator';
import { UpdateUserDto } from '../../users/dtos/update-user.dto';

export class UpdateProfileDto extends UpdateUserDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  website?: string;
}
