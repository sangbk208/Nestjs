import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import {Model} from 'mongoose'
import { ChangePasswordIDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}

  async getMe(id:string){
    const user = await this.userModel.findById(id).select("-password")
    return {
      statusCode: 200,
      data:user,
      message: "Success!",
    }
  }

  async changePassword(id:string, changePasswordIDto:ChangePasswordIDto) {
    const {password, confirmedPassword} = changePasswordIDto;
    if (password!==confirmedPassword){
      throw new BadRequestException("Password must match confirmedPassword")
    }

    const salt = await bcrypt.genSalt(10);
    const passwordEncode = await bcrypt.hash(password, salt);

    await this.userModel.findByIdAndUpdate(id, {password: passwordEncode})

    return {
      statusCode: 200,
      message: "Change password successful!",
    }
  }
}