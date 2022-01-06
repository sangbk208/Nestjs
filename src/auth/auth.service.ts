import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signUp.dto';
import * as bcrypt from 'bcrypt';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async loginLocal(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('User does not exist!');
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      throw new UnauthorizedException('Incorrect Password !');
    }

    return { email, name: user.name, id: user._id };
  }

  async createJwt(email: string, name: string, id: string) {
    const payload = {
      email,
      name,
      id,
    };
    const token = await this.jwtService.sign(payload);
    return token;
  }

  async signUpLocal(signUpDto: SignUpDto) {
    const { email, password, name } = signUpDto;
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new UnauthorizedException('User already exists!');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordEncode = await bcrypt.hash(password, salt);

    const newUser = await this.userModel.create({
      email,
      name,
      password: passwordEncode,
    });

    const payload = {
      id: newUser._id,
      email,
      name,
    };
    const verifyToken = await this.generateToken(payload, { expiresIn: '10m' });
    await this.mailService.sendUserVerify({ email, name }, verifyToken);

    return {
      statusCode: 201,
      message: 'Signup successful, pls check mail to verify your account',
    };
  }

  async verifyUser(token: string) {
    const { email } = await this.verifyToken(token);
    const user = await this.userModel.findOne({ email });

    if (user && !user.verified) {
      user.verified = true;
      await user.save();
      return {
        statusCode: 200,
        message: 'Verify successful!',
      };
    }
    throw new BadRequestException('Confirmation error');
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('User does not exist!');
    }

    const resetPasswordToken = await this.jwtService.sign({
      email,
      name: user.name,
      id: user._id,
    });

    return {
      resetPasswordToken,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { resetPasswordToken, password, confirmedPassword } =
      resetPasswordDto;

    if (password !== confirmedPassword) {
      throw new BadRequestException('Password must match confirmedPassword');
    }

    const data = await this.verifyToken(resetPasswordToken);
    const { id } = data;

    const salt = await bcrypt.genSalt(10);
    const passwordEncode = await bcrypt.hash(password, salt);

    await this.userModel.findByIdAndUpdate(id, { password: passwordEncode });

    return {
      statusCode: 200,
      message: 'Reset password successful!',
    };
  }

  private async generateToken(data: any, options?: any): Promise<string> {
    return this.jwtService.sign(data, options);
  }

  private async verifyToken(token) {
    const data = await this.jwtService.verify(token);

    if (!data) {
      throw new UnauthorizedException();
    }

    return data;
  }
}
