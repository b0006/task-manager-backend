import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { User } from './users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find({}, 'username').exec();
  }

  async findOne(username: string): Promise<Partial<User>> {
    return this.userModel.findOne({ username }).lean(true).exec();
  }
}
