import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import {Model} from 'mongoose'
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signUp.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService
    ){}

    async loginLocal(loginDto: LoginDto){
        const {email, password} = loginDto;
        const user = await this.userModel.findOne({email})
        if (!user){
            throw new UnauthorizedException("User does not exist!")
        }

        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            throw new UnauthorizedException("Incorrect Password !")
        } 

        return { email, name: user.name };
    }

    async createJwt(email:string, name:string){
        const payload ={
            email, 
            name
        }
        const token = await this.jwtService.sign(payload)
        return token
    }

    async signUpLocal(signUpDto: SignUpDto){
        const {email, password, name} = signUpDto;
        const user = await this.userModel.findOne({email})
        if (user){
            throw new UnauthorizedException("User already exists!")
        }

        const salt = await bcrypt.genSalt(10);
        const passwordEncode = await bcrypt.hash(password, salt);

        await this.userModel.create({
            email,
            name,
            password: passwordEncode
        })

        return {
            statusCode: 201,
            message: "Signup successful!",
        }
    }
}
