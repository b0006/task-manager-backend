import { Injectable } from '@nestjs/common';
import { LeanDocument, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { User } from './users.schema';
import { UserCreateDto } from './dto/user.create.dto';
import { UserFindOneDto } from './dto/user.find-one.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find({}, 'username').exec();
  }

  async findOne(data: Partial<UserFindOneDto>): Promise<LeanDocument<User>> {
    const user = await this.userModel
      .findOne({
        $or: [{ username: data.username }, { email: data.email }],
      })
      .exec();

    return user.toJSON();
  }

  async findOneByUsername(username: string): Promise<Partial<User>> {
    return this.userModel.findOne({ username }).lean(true).exec();
  }

  async create(userData: UserCreateDto): Promise<User> {
    return this.userModel.create(userData);
  }
}
