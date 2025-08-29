import { IsString } from 'class-validator';

export abstract class UserEventDto {
  @IsString()
  actorId!: string;
  @IsString()
  userId!: string;
}
