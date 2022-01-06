import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import {Model} from 'mongoose'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}

  create(user: User) {
    // this.users.push(user);
  }

  async getMe(id): Promise<User> {
    const user = await this.userModel.findById(id)
    return user
  }
}