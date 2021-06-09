import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class BoardCreateDto {
  @IsNotEmpty()
  title: Types.ObjectId;

  @IsNotEmpty()
  authorId: Types.ObjectId;

  isPrivate?: boolean;

  allowedUserListId?: Types.ObjectId[];
}
