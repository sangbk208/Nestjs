import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { Model } from 'mongoose';

@Injectable()
export class UsersRespository{
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}
}